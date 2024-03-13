package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"os"
	"time"
)

const EnvKeyBucketName = "BUCKET_NAME"

var s3Client *s3.S3
var bucketName string

func init() {
	bucketName = os.Getenv(EnvKeyBucketName)
	sess, err := session.NewSession(&aws.Config{})
	if err != nil {
		panic(err)
	}

	s3Client = s3.New(sess, &aws.Config{})
}

func main() {
	lambda.Start(handler)
}

func handler(ctx context.Context, content string) (string, error) {
	// Create a file in S3
	fileKey := fmt.Sprintf("/private/sample-%d.txt", time.Now().Unix())
	fileInput := s3.PutObjectInput{
		Body:               bytes.NewReader([]byte(content)),
		Key:                aws.String(fileKey),
		Bucket:             aws.String(bucketName),
		ContentDisposition: aws.String(fmt.Sprintf(`attachment; filename=%q`, "sample.txt")),
		ContentType:        aws.String("text/plain"),
		ContentLength:      aws.Int64(int64(len(content))),
	}

	_, filePutErr := s3Client.PutObjectWithContext(ctx, &fileInput)
	if filePutErr != nil {
		return "", filePutErr
	}

	// Generate pre-signed URL
	req, _ := s3Client.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileKey),
	})

	// Set the expiration time of the URL
	duration := time.Minute * 1
	urlStr, err := req.Presign(duration)

	if err != nil {
		return "", fmt.Errorf(
			"failed to generate pre-signed URL for bucket: %s and key: %s, %s",
			bucketName,
			fileKey,
			err.Error())
	}

	return urlStr, nil
}
