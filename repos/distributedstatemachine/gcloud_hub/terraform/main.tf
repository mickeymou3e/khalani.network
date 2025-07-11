terraform {
  backend "gcs" {
    /* TODO: remove production from the bucket name */
    bucket = "ekzl-hub-tf-state-production"
    prefix = "terraform/state"
  }
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.3"
    }
    google = {
      source  = "hashicorp/google"
      version = "4.84.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.1.0"
    }
  }
}

provider "google" {
  project = "civil-lambda-374300"
  region  = "us-central1"
}


# Configure kubernetes provider with Oauth2 access token.
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/client_config
# This fetches a new token, which will expire in 1 hour.
data "google_client_config" "default" {
  depends_on = [module.gke]
}

# Defer reading the cluster data until the GKE cluster exists.
/* data "google_container_cluster" "primary" {
  name       = var.cluster_name
  depends_on = [module.gke]
} */

/* provider "kubernetes" {
  host  = "https://${data.google_container_cluster.default.endpoint}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.default.master_auth[0].cluster_ca_certificate,
  )
}

provider "helm" {
  kubernetes {
    host  = "https://${data.google_container_cluster.default.endpoint}"
    token = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(
      data.google_container_cluster.default.master_auth[0].cluster_ca_certificate,
    )
  }
}

module "gke" {
  source = "./modules/gke"
  /* vpc_name     = module.vpc.vpc_name 
  vpc_name = "default"

  cluster_name = var.cluster_name
}
/* 
resource "helm_release" "reloader" {
  name             = "reloader"
  chart            = "reloader"
  version          = "1.0.29"
  repository       = "https://stakater.github.io/stakater-charts"
  namespace        = "kube-addons"
  create_namespace = true
} */

module "secrets" {
  source = "./modules/secrets"

  # TODO: Pass variables
}

/* module "vpc" {
  source = "./modules/vpc"

  # TODO: Pass variables
} */

/* module "nfs" {
  source   = "./modules/nfs"
  vpc_name = module.vpc.vpc_name
  /* vpc_input = output.vpc_output 


  # TODO: Pass variables
} */


/* module "iam" {
  source               = "./modules/iam"
  project              = var.project
  service_account_name = var.service_account_name
} */

/* module "hub" {
  source = "./modules/hub"

  domain_name          = var.domain_name
  kubernetes_namespace = "hub"
  oidc_provider_arn    = module.eks.oidc_provider_arn
} */

/* output "vpc_output" {
  value = module.vpc
} */
