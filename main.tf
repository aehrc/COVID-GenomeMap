provider aws {
  region = "ap-southeast-2"
}

provider aws {
  alias = "useast1"
  region = "us-east-1"
}

module lambda_refreshCloudfront {
  source = "./modules/lambda"

  function_name = "refreshCloudfront"
  description = "Refreshes Cloudfront when s3 object content changes."
  memory_size = 128
  runtime = "python3.8"
  timeout = 1
  source_path = "${path.module}/lambda/refreshCloudfront/source"
  handler = "function.lambda_handler"

  policy = {
    json = data.aws_iam_policy_document.lambda_refreshCloudfront.json
  }
}