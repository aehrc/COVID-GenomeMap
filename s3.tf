locals {
  content_types = {
    "css" = "text/css; charset=utf-8"
    "eot" = "application/vnd.ms-fontobject"
    "html" = "text/html; charset=utf-8"
    "jpg" = "image/jpeg"
    "js" = "application/javascript"
    "otf" = "font/otf"
    "svg" = "image/svg"
    "ttf" = "font/ttf"
    "woff" = "font/woff"
  }
}

resource aws_s3_bucket website_bucket {
  bucket = "covid19-platform"

  versioning {
    enabled = true
  }

  website {
    redirect_all_requests_to = "https://${var.domain_name}"
  }
}

resource aws_s3_bucket_notification refreshCloudfront {
  bucket = aws_s3_bucket.website_bucket.id

  lambda_function {
    lambda_function_arn = module.lambda_refreshCloudfront.function_arn
    events = [
      "s3:ObjectCreated:*",
    ]
  }

  depends_on = [aws_lambda_permission.s3_refreshCloudfront]
}

resource aws_s3_bucket_object website_index {
  for_each = fileset("${path.module}/website", "**")
  bucket = aws_s3_bucket.website_bucket.id
  content_type = local.content_types[regex("[^.]*$", each.value)]
  key = each.value
  source = "${path.module}/website/${each.value}"
  etag = filemd5("${path.module}/website/${each.value}")
}

resource aws_s3_bucket_policy cloudfront_access {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.cloudfront_website_access.json
}
