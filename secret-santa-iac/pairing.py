import json
import boto3
import logging
from botocore.exceptions import ClientError

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Define S3 bucket name
BUCKET_NAME = 'secret-santa-pairings-dev'  # Update based on your stage

s3_client = boto3.client('s3')

def handler(event, context):
    # Get the token from query parameters
    token = event.get("queryStringParameters", {}).get("token")
    if not token:
        logger.error("No token provided in request.")
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Token is required"})
        }

    # Retrieve the token data from S3
    try:
        token_data = get_token_data(token)
    except ClientError as e:
        error_code = e.response['Error']['Code']
        logger.error(f"Error retrieving token: {error_code}")
        if error_code == 'NoSuchKey':
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Token not found"})
            }
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"})
        }

    # Check if the token has already been used
    if token_data.get("status") == "used":
        logger.info(f"Token {token} has already been used.")
        return {
            "statusCode": 403,
            "body": json.dumps({"error": "Token already used"})
        }

    # Update the token status to "used"
    token_data["status"] = "used"
    if not update_token_data(token, token_data):
        logger.error(f"Failed to update status for token {token}.")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to update token status"})
        }

    # Return the pairing details
    response_body = {
        "gifter": token_data.get("gifter"),
        "giftee": token_data.get("giftee")
    }

    return {
        "statusCode": 200,
        "body": json.dumps(response_body)
    }

def get_token_data(token):
    key = f"{token}.json"
    try:
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=key)
        token_data = json.loads(response['Body'].read().decode("utf-8"))
        return token_data
    except ClientError as e:
        logger.error(f"Error retrieving data for token {token}: {e}")
        raise

def update_token_data(token, token_data):
    key = f"{token}.json"
    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=json.dumps(token_data),
            ContentType="application/json"
        )
        return True
    except ClientError as e:
        logger.error(f"Error updating data for token {token}: {e}")
        return False