variable "account_id" {
  description = "The ARN of the AWS root account"
  type        = string
}

variable "oidc_url" {
  description = "The URL of the AWS OIDC"
  type        = string
}

variable "service_account_name" {
  description = "The name of the Kubernetes service account for Graph Node"
  type        = string
}

variable "kubernetes_namespace" {
  description = "The namespace to deploy Graph Node to"
  type        = string
}

variable "connection_urls_secret" {
  description = "Secret ARN in Secrets Manager containing chain names and RPC URLs"
  type        = string
}

variable "domain_name" {
  type        = string
}
