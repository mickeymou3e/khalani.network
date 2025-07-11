variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
}

variable "workers_count" {
  description = "The initial number of nodes in the GKE cluster"
  type        = number
  /* @TODO: Replace once we sort out quota issues */
  default = 1
}

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
}

variable "machine_type" {
  description = "The machine type for the nodes in the GKE cluster"
  type        = string
  /* default     = "n1-highmem-8" */
  /* default = "e2-medium" */
  default = "n1-standard-32"

}

variable "oauth_scopes" {
  description = "The OAuth scopes for the nodes in the GKE cluster"
  type        = list(string)
  default = [
    "https://www.googleapis.com/auth/compute",
    "https://www.googleapis.com/auth/devstorage.read_write",
    "https://www.googleapis.com/auth/logging.write",
    "https://www.googleapis.com/auth/monitoring",
  ]
}
