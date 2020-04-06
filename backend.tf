terraform {
  backend "s3" {
    bucket = "covid19-website-terraform-state"
    key = "terraform.tfstate"
    region = "ap-southeast-2"
    dynamodb_table = "terraform-state-locks"
  }
}
