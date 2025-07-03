variable "account_id" {
  description = "The ARN of the root account"
  type        = string
}

variable "oidc_url" {
  description = "The URL of the OIDC"
  type        = string
}

variable "solver_roles" {
  description = "List of solver roles"
  type        = list(string)
  default     = ["cross-chain-market-maker", "spoke-chain-caller", "intentbook-matchmaker", "settler"]
}
