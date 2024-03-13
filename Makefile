# To force rebuild on these kind since we also have a directory by the same name as that of make alias
.PHONY: deploy

# Build and package our Go program
build:
	env CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o bin/bootstrap cmd/main.go
	zip bin/uploader.zip bin/bootstrap

# Alias to bootstrap our CDK project
bootstrap:
	cd deploy && cdk bootstrap

# Alias to deploy our CDK project
deploy:
	cd deploy && cdk deploy --require-approval never

# Alias to destroy our CDK project
destroy:
	cd deploy && cdk destroy --require-approval never