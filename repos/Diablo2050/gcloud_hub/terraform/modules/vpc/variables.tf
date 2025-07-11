variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
  default     = "default"
}

variable "auto_create_subnetworks" {
  description = "Whether to automatically create subnetworks for this network"
  type        = bool
  default     = true
}
