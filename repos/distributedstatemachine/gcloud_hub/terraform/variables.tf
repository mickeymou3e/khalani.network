variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "hub-staging"
}


variable "service_account_name" {
  description = "The name of the service account for GKE cluster"
  type        = string
  default     = "hub-staging-service-account"
}

variable "project" {
  description = "The name of the service account for GKE cluster"
  type        = string
  default     = "civil-lambda-374300"
}

variable "k8s_service_account" {
  type    = string
  default = "hub-staging-service-account"
}