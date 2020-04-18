output AWS_ACCESS_KEY_ID {
  value = aws_iam_access_key.data_uploader.id
}

output encrypted_AWS_SECRET_ACCESS_KEY {
  value = aws_iam_access_key.data_uploader.encrypted_secret
}

output cloudfront_domain_name {
    value = aws_cloudfront_distribution.platform_distribution.domain_name
    description = "URL for website hosted by cloudfront."
}
