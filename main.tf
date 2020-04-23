provider aws {
  region = "ap-southeast-2"
}

provider aws {
  alias = "useast1"
  region = "us-east-1"
}

module lambda_cloudfrontEdgeSecurity {

  source = "./modules/lambda"

  function_name = "cloudfrontEdgeSecurity"
  description = "Adds security headers to cloudfront requests."
  memory_size = 128
  runtime = "python3.8"
  timeout = 2
  source_path = "${path.module}/lambda/cloudfrontEdgeSecurity/source"
  handler = "function.lambda_handler"
  lambda_at_edge = true

  policy = {
    json = data.aws_iam_policy_document.lambda_refreshCloudfront.json
  }

  providers = {
    aws = aws.useast1
  }
}

module lambda_refreshCloudfront {
  source = "./modules/lambda"

  function_name = "refreshCloudfront"
  description = "Refreshes Cloudfront when s3 object content changes."
  memory_size = 128
  runtime = "python3.8"
  timeout = 10
  source_path = "${path.module}/lambda/refreshCloudfront/source"
  handler = "function.lambda_handler"

  policy = {
    json = data.aws_iam_policy_document.lambda_refreshCloudfront.json
  }

  environment = {
    variables = {
      DISTRIBUTION_ID = aws_cloudfront_distribution.platform_distribution.id
    }
  }
}
