variable bucket_name {
  description = "Name for the bucket containing the website"
}

variable max_web_requests_per_ip_in_five_minutes {
  type = number
  default = 300
}

variable pgp_public_key {
  description = "public pgp key file for encrypting the secret access key output value"
}

variable to_upload {
  description = "Files path(s) to which the data_uploader is allowed to upload."
}
