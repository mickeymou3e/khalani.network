variable "region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "role_arn" {
  description = "The IAM role having GetPublicKey/Sign permissions for this KMS"
  type        = string
  default     = "arn:aws:iam::803035318642:role/faucet"
}

variable "root_arn" {
  description = "The ARN of the root user, having full control over the KMS"
  type        = string
  default     = "arn:aws:iam::803035318642:root"
}