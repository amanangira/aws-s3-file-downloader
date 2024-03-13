#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsS3FileDownloaderStack } from '../lib/aws-s3-file-downloader-stack';

const app = new cdk.App();
new AwsS3FileDownloaderStack(app, 'AwsS3FileDownloaderStack', {});