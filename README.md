# Secret Santa

Check it live on [jose-oc.github.io/secretsanta/](http://jose-oc.github.io/secretsanta/).

# Releases

## v1.0.0

This version is a static html and javascript that works with just a browser, it doesn't even require internet.

https://github.com/jose-oc/secretsanta/releases/tag/v1.0.0

## v2.0.0

You can see your pair (giftee) only once. 

The way this is implemented is by generating a one-time token stored on AWS S3. An AWS Lambda function will create and modify the file on the bucket.

### Prerequisites

You need to have nodejs installed. 
You also need to have aws configured with your credentials. 

Install serverless framework

```shell
npm install -g serverless@3.38.0
```

### Compila the function

```
cd function
GOOS=linux GOARCH=amd64 go build -o pairing pairing.go
```

### Create infrastructure

First, create an AWS user:

```shell
aws iam create-user --user-name serverless-user
aws iam create-policy --policy-name ServerlessPolicy --policy-document file://serverless-policy.json
aws iam attach-user-policy --user-name serverless-user --policy-arn arn:aws:iam::123456789012:policy/ServerlessPolicy
aws iam create-access-key --user-name serverless-user
```


```
cd secret-santa-iac
serverless
```

Deploy the S3 Bucket to AWS

Deploy the infrastructure defined in serverless.yml:

```
# Deploy to the default stage (dev)
serverless deploy
```

To deploy to a specific stage (like prod), you can use:

```
serverless deploy --stage prod
```

To verify, you can check:
```
serverless info
```

To remove
```
serverless remove
```



## License (MIT)

> **Copyright © 2015 Maël Nison**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
