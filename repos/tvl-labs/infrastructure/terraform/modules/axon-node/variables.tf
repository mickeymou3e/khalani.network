variable "account_id" {
  description = "The AWS Account ID"
  type        = string
  default     = "arn:aws:iam::803035318642"
}

variable "oidc_url" {
  description = "The URL of the OIDC"
  type        = string
}
