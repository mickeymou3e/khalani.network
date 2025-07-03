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

variable "funding_bot_role_arn" {
  description = "The ARN of the funding bot role"
  type        = string
  default     = "arn:aws:iam::803035318642:role/funding-bot"
}
