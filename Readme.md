### Introduction 
This repository showcases a solution of using a public repository for hosting private files with no direct public 
URL access but providing a signed URL to begin download of the same and auto cleanup these files after one day using 
S3 lifecycle rules. 

### Use Case
Recently I had a scenario where on user input I had to generate large report and then begin downloading it. Implying the
requirements the reports were no longer relevant once these were downloaded. Also, these reports were not supposed to be
publicly accessible.

The use case of storing private files in public bucket might seem strange but could be a valid use case given you already
have a domain suited public bucket and, you don't want to add another bucket just for private files.

### Pre-requisites
1. AWS CDK framework installed and configured with appropriate AWS access and secret key.
2. Basic understanding of Go for lambda logic.
3. Basic understanding of AWS S3 and Lambda.

### Solution
The solution was to use AWS S3 to store the reports, limit the access using S3 bucket policy and use pre-signed URLs
with defined expiration to access the reports.