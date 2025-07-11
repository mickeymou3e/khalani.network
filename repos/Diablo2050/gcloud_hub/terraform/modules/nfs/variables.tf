variable "nfs_name" {
  description = "The name of the NFS server"
  type        = string
  default     = "nfs-server"
}

variable "nfs_tier" {
  description = "The tier of the NFS server"
  type        = string
  default     = "STANDARD"
}

variable "nfs_zone" {
  description = "The zone of the NFS server"
  type        = string
  /*  @TODO: Putting it in asia until we resolve our quota issues */
  default = "us-central1-a"
  /* default = "asia-northeast1" */
}

variable "file_share_capacity_gb" {
  description = "The capacity of the file share in GB"
  type        = number
  default     = 1024
}

variable "file_share_name" {
  description = "The name of the file share"
  type        = string
  default     = "celery_flask"
}

variable "nfs_network_modes" {
  description = "The network modes for the NFS server"
  type        = list(string)
  default     = ["MODE_IPV4"]
}

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
}

/* variable "vpc_input" {
  description = "The output of the vpc module"
  type        = any
} */
