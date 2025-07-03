terraform {
  backend "s3" {
    bucket = "unified-terraform-state"
    region = "us-east-1"
    key    = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.region
}

locals {
  config_path = "~/.kube/config"
}

provider "kubectl" {
  config_path = pathexpand(local.config_path)
  host        = var.cluster_endpoint
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", var.cluster_name, "--profile", "k8sadmin"]
    command     = "aws"
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", var.cluster_name, "--profile", "k8sadmin"]
      command     = "aws"
    }
  }
}

provider "random" {
  # Configuration options
}
