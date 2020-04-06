data aws_iam_policy_document lambda_refreshCloudfront {
  statement {
    actions = [
      "cloudfront:CreateInvalidation",
    ]
    resources = [
      "*"
    ]
  }
}

data aws_iam_policy_document data_uploader {
  statement {
    actions = [
      "s3:PutObjectAcl",
      "s3:PutObject",
    ]
    resources = [
      for upload_path in var.to_upload:
      "${aws_s3_bucket.website_bucket.arn}/${upload_path}"
    ]
  }
}

resource aws_iam_access_key data_uploader {
  user = aws_iam_user.data_uploader.name
  pgp_key = filebase64(var.pgp_public_key)
}

resource aws_iam_policy data_uploader {
  name = "dataUploader"
  description = "Allow to upload only to specified s3 location"
  policy = data.aws_iam_policy_document.data_uploader.json
}

resource aws_iam_user data_uploader {
  name = "dataUploader"
  force_destroy = true
}

resource aws_iam_user_policy_attachment data_uploader {
  policy_arn = aws_iam_policy.data_uploader.arn
  user = aws_iam_user.data_uploader.name
}
