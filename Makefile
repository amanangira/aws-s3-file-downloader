.PHONY: deploy

build:
	env CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o bin/bootstrap cmd/main.go
	zip bin/uploader.zip bin/bootstrap

deploy:
	cd deploy && cdk deploy --require-approval never

destroy:
	cd deploy && cdk destroy --require-approval never

version:
	cd deploy && cdk --version