variable "admin_email" {
  type        = string
}

variable "aws_hosted_zone_id" {
  type = string
}

variable "domain_certificate" {
  type = string
}

variable "domain_name" {
  type        = string
}

variable "kubernetes_namespace" {
  type        = string
}

variable "oidc_provider_arn" {
  type        = string
}
