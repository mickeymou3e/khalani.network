terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "axon-tf-state"
    key    = "state/ec2-kms"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}