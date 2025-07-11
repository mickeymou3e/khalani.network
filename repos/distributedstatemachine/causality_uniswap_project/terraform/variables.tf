variable "address_count" {
  description = "The number of resources to create"
  type        = number
  default     = 3
}

variable "region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "account_id" {
  description = "The AWS Account ID"
  type        = string
  default     = "arn:aws:iam::803035318642"
}

variable "access_key" {
  description = "SSH key pair name"
  type = string
}

variable "instance_type" {
    type = string
    description = "ec2 instance type"
}