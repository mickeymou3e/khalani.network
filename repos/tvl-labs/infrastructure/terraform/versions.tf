terraform {
  required_version = ">= 1.5"

  required_providers {
    aws        = ">= 5"
    helm       = ">= 2.10.1"
    kubernetes = ">= 2.10.0"
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "= 1.13.1"
    }
  }
}
