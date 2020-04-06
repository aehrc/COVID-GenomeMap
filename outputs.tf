output AWS_ACCESS_KEY_ID {
  value = aws_iam_access_key.data_uploader.id
}

output encrypted_AWS_SECRET_ACCESS_KEY {
  value = aws_iam_access_key.data_uploader.encrypted_secret
}

output website_url {
  value = aws_s3_bucket.website_bucket.website_endpoint
}
