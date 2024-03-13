# Welcome to your CDK TypeScript project

This is a demo project to showcase the use of AWS CDK to create a simple S3 public bucket, a Lambda function to upload 
files to the bucket and generate a pre-signed URL to download the file restricting public access to the object.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
