variable "admin_email" {
  type = string
}

variable "region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "validator_count" {
  description = "The number of resources to create"
  type        = number
  default     = 3
}

variable "chains" {
  description = "List of chains the relayers will be deployed to"
  type        = list(string)
  default     = ["sepolia", "fuji", "khalani-testnet"]
}

variable "account_id" {
  description = "The AWS Account ID"
  type        = string
  default     = "arn:aws:iam::803035318642"
}

variable "min_size" {
  type        = string
  description = "Cluster minimum node number"
}

variable "max_size" {
  type        = string
  description = "Cluster maximum node number"
}

variable "desired_size" {
  type        = string
  description = "Cluster desired node number"
}

variable "instance_types" {
  type        = list(any)
  description = "Cluster list of instance types"
}

variable "ec2_ssh_key" {
  type        = string
  description = "Key pair used to access cluster nodes"
}

variable "cluster_name" {
  type = string
}

variable "cluster_endpoint" {
  type = string
}

variable "disk_size" {
  type        = string
  description = "Cluster node disk size"
}

variable "vpc_cidr" {
  type = string
}

variable "vpc_name" {
  type = string
}

variable "azs" {
  type = list(any)
}

variable "private_subnets" {
  type = list(any)
}

variable "public_subnets" {
  type = list(any)
}

variable "domain_name" {
  type        = string
  description = "Domain name to deploy applications to"
}

variable "domain_certificate" {
  type = string
}

variable "aws_hosted_zone_id" {
  type        = string
  description = "AWS Route53 Hosted Zone ID to deploy applications to"
}