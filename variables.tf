variable bucket_name {
  description = "Name for the bucket containing the website"
}

variable domain_name {
  description = "Domain name at which the website should be accessed. Does not include the https:// prefix."
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
