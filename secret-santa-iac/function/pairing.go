package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

const (
	bucketName = "secret-santa-pairings-dev" // Change based on your stage
)

type TokenData struct {
	Token  string `json:"token"`
	Gifter string `json:"gifter"`
	Giftee string `json:"giftee"`
	Status string `json:"status"`
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	token := request.QueryStringParameters["token"]
	if token == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       `{"error": "Token is required"}`,
		}, nil
	}

	sess := session.Must(session.NewSession())
	s3Client := s3.New(sess)

	tokenData, err := getTokenData(s3Client, token)
	if err != nil {
		if err != nil && err.Error() == s3.ErrCodeNoSuchKey {
			return events.APIGatewayProxyResponse{
				StatusCode: 404,
				Body:       `{"error": "Token not found"}`,
			}, nil
		}
		log.Println("Error retrieving token:", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: `{"error": "Internal server error"}`}, nil
	}

	if tokenData.Status == "used" {
		return events.APIGatewayProxyResponse{
			StatusCode: 403,
			Body:       `{"error": "Token already used"}`,
		}, nil
	}

	tokenData.Status = "used"
	err = updateTokenData(s3Client, token, tokenData)
	if err != nil {
		log.Println("Error updating token status:", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: `{"error": "Failed to update token status"}`}, nil
	}

	responseBody, _ := json.Marshal(map[string]string{
		"gifter": tokenData.Gifter,
		"giftee": tokenData.Giftee,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}

func getTokenData(s3Client *s3.S3, token string) (*TokenData, error) {
	key := fmt.Sprintf("%s.json", token)
	result, err := s3Client.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, err
	}
	defer result.Body.Close()

	var tokenData TokenData
	err = json.NewDecoder(result.Body).Decode(&tokenData)
	if err != nil {
		return nil, err
	}

	return &tokenData, nil
}

func updateTokenData(s3Client *s3.S3, token string, tokenData *TokenData) error {
	key := fmt.Sprintf("%s.json", token)
	body, err := json.Marshal(tokenData)
	if err != nil {
		return err
	}

	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
		Body:   aws.ReadSeekCloser(bytes.NewReader(body)),
	})
	return err
}

func main() {
	lambda.Start(handler)
}
