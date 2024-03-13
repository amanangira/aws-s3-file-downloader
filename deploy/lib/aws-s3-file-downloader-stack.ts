import {aws_iam, aws_s3, Duration, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket} from "aws-cdk-lib/aws-s3";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import {Effect} from "aws-cdk-lib/aws-iam";

export class AwsS3FileDownloaderStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const bucketName = "s3-private-content-bucket";
    const bucket = new Bucket(
        this,
        bucketName,
        {
          bucketName: bucketName,
          versioned: false,
          blockPublicAccess: {
            blockPublicAcls: false,
            blockPublicPolicy: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false,
          },
          // we set the removal policy to DESTROY to delete the bucket when the stack is deleted
          removalPolicy: RemovalPolicy.DESTROY,
          // we set autoDeleteObjects to true to delete all the objects in the bucket when the stack is deleted
          autoDeleteObjects: true,
          lifecycleRules: [{
            expiration: Duration.days(1),
            enabled: true,
            prefix: "private/"
          }]
        }
    );

    // Add policy to restrict public access to private directory
    bucket.addToResourcePolicy(new aws_iam.PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new aws_iam.AnyPrincipal()],
      actions: ["s3:GetObject"],
      notResources: [ bucket.bucketArn.toString() + "/private/*"  ]
    }));

    // Configure Lambda
    const lambdaName = `file-url-generator`;
    const handler = new Function(this, lambdaName, {
      runtime: Runtime.PROVIDED_AL2,
      code: Code.fromAsset(path.join(__dirname, "..", "..", "bin")),
      handler: "bootstrap",
      functionName: lambdaName,
      environment: {
        "BUCKET_NAME" : bucketName,
      },
      memorySize: 128,
      timeout: Duration.minutes(15),
    });

    // Configure Lambda role inline permissions
    bucket.grantReadWrite(handler)
}}
