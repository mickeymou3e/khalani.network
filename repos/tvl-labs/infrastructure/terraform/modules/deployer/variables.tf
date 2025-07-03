variable "region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "account_id" {
  description = "The AWS Account ID"
  type        = string
  default     = "arn:aws:iam::803035318642"
}

variable "group_name" {
  description = "The group name of deployer permissions in IAM Identity Center (SSO)"
  type        = string
  default     = "TVL Smart Contract Deployer"
}
