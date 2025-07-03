variable "aws_hosted_zone_id" {
  type = string
}

variable "domain_certificate" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "applications" {
  type = list
}

variable "environments" {
  type = list
}