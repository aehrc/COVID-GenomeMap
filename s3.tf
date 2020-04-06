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
  acl = "public-read"

  website {
    index_document = "index.html"
  }
}

resource aws_s3_bucket_object website_index {
  for_each = fileset("${path.module}/website", "**")
  bucket = aws_s3_bucket.website_bucket.id
  acl = "public-read"
  content_type = local.content_types[regex("[^.]*$", each.value)]
  key = each.value
  source = "${path.module}/website/${each.value}"
  etag = filemd5("${path.module}/website/${each.value}")
}
