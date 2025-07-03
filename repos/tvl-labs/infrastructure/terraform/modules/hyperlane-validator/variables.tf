variable "validator_count" {
  description = "The number of resources to create"
  type        = number
}

variable "validator_chain" {
  description = "The chain on which the validators are deployed"
  type        = string
}

variable "oidc_url" {
  description = "The URL of the OIDC"
  type        = string
}

variable "account_id" {
  description = "The ARN of the root account"
  type        = string
}
