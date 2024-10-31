import json
import boto3
import logging
import uuid
from botocore.exceptions import ClientError

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
BUCKET_NAME = 'secret-santa-pairings-dev'  # Adjust based on your environment

def handler(event, context):
    http_method = event['httpMethod']
    
    if http_method == 'POST':
        return create_token(event)
    elif http_method == 'GET':
        return get_pairing(event)
    else:
        return {
            "statusCode": 405,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": "Method not allowed"})
        }

def create_token(event):
    body = json.loads(event['body'])
    gifter = body.get("gifter")
    giftee = body.get("giftee")
    token = str(uuid.uuid4())  # Generate a unique token

    token_data = {
        "token": token,
        "gifter": gifter,
        "giftee": giftee,
        "status": "unused"
    }

    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=f"{token}.json",
            Body=json.dumps(token_data),
            ContentType="application/json"
        )
    except ClientError as e:
        logger.error(f"Error creating the token file in S3: {error_code}")
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Failed to create token", "details": str(e)})
        }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"token": token})
    }

def get_pairing(event):
    token = event.get("queryStringParameters", {}).get("token")
    if not token:
        logger.error("No token provided in request.")
        return {"statusCode": 400, 
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Token is required as query param"})
                }

    try:
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=f"{token}.json")
        token_data = json.loads(response['Body'].read())
        
        if token_data["status"] == "used":
            return {
                "statusCode": 403, 
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Token already used"})
                }
        
        token_data["status"] = "used"
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=f"{token}.json",
            Body=json.dumps(token_data),
            ContentType="application/json"
        )
        
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"gifter": token_data["gifter"], "giftee": token_data["giftee"]})
        }
    except ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            return {"statusCode": 404, "headers": {"Access-Control-Allow-Origin": "*"},"body": json.dumps({"error": "Token not found"})}
        logger.error(f"Error retrieving token: {e}")
        return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*"},"body": json.dumps({"error": "Internal server error", "details": str(e)})}