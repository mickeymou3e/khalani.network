# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0


data "google_compute_zones" "available" {
}

data "google_container_engine_versions" "supported" {
  location = data.google_compute_zones.available.names[0]
  /* version_prefix = var.kubernetes_version */
}

# If the result is empty '[]', the GKE default_cluster_version will be used.
output "available_master_versions_matching_user_input" {
  value = data.google_container_engine_versions.supported.valid_master_versions
}

resource "google_container_cluster" "primary" {
  name = var.cluster_name
  /* location           = data.google_compute_zones.available.names[0] */
  location = "us-central1"
  network  = var.vpc_name
  /* network = "default" */

  initial_node_count = var.workers_count
  min_master_version = data.google_container_engine_versions.supported.latest_master_version
  node_version       = data.google_container_engine_versions.supported.latest_master_version

  /* location           = "us-central1" */

  enable_autopilot = true

  node_locations = [
    data.google_compute_zones.available.names[1],
  ]
  node_config {
    machine_type = var.machine_type
    oauth_scopes = var.oauth_scopes
    disk_size_gb = 100
    disk_type    = "pd-standard"
  }


}

/* data "template_file" "kubeconfig" {
  template = file("${path.module}/kubeconfig-template.yaml")

  vars = {
    cluster_name    = google_container_cluster.primary.name
    user_name       = google_container_cluster.primary.master_auth[0].username
    user_password   = google_container_cluster.primary.master_auth[0].password
    endpoint        = google_container_cluster.primary.endpoint
    cluster_ca      = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
    client_cert     = google_container_cluster.primary.master_auth[0].client_certificate
    client_cert_key = google_container_cluster.primary.master_auth[0].client_key
  }
} */

/* resource "local_file" "kubeconfig" {
  content  = data.template_file.kubeconfig.rendered
  filename = "${path.module}/kubeconfig"
} */

/* provider "kubernetes" {
  load_config_file = "false"

  host = google_container_cluster.primary.endpoint

  username               = google_container_cluster.primary.master_auth[0].username
  password               = google_container_cluster.primary.master_auth[0].password
  client_certificate     = base64decode(google_container_cluster.primary.master_auth[0].client_certificate)
  client_key             = base64decode(google_container_cluster.primary.master_auth[0].client_key)
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
} */

/* resource "kubernetes_namespace" "applications" {
  metadata {
    name = "applications"
  }
} */

/* resource "kubernetes_storage_class" "nfs" {
  metadata {
    name = "filestore"
  }
  reclaim_policy      = "Retain"
  storage_provisioner = "nfs"
}

resource "kubernetes_persistent_volume" "shared_volume" {
  metadata {
    name = "nfs-volume"
  }
  spec {
    capacity = {
      storage = "1T"
    }
    storage_class_name = kubernetes_storage_class.nfs.metadata[0].name
    access_modes       = ["ReadWriteMany"]
    persistent_volume_source {
      nfs {
        server = google_filestore_instance.test.networks[0].ip_addresses[0]
        path   = "/${google_filestore_instance.test.file_shares[0].name}"
      }
    }
  }
} */

/* resource "kubernetes_persistent_volume_claim" "example" {
  metadata {
    name      = "mariadb-data"
    namespace = "test"
  }
  spec {
    access_modes       = ["ReadWriteMany"]
    storage_class_name = kubernetes_storage_class.nfs.metadata[0].name
    volume_name        = kubernetes_persistent_volume.example.metadata[0].name
    resources {
      requests = {
        storage = "1T"
      }
    }
  }
} */

/* resource "kubernetes_deployment" "mariadb" {
  metadata {
    name      = "mariadb-example"
    namespace = "test"
    labels = {
      mylabel = "MyExampleApp"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        mylabel = "MyExampleApp"
      }
    }

    template {
      metadata {
        labels = {
          mylabel = "MyExampleApp"
        }
      }

      spec {
        container {
          image = "mariadb:10.5.2"
          name  = "example"

          env {
            name  = "MYSQL_RANDOM_ROOT_PASSWORD"
            value = true
          }

          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "50Mi"
            }
          }

          volume_mount {
            mount_path = "/var/lib/mysql"
            name       = "mariadb-data"
          }
        }
        volume {
          name = "mariadb-data"
          persistent_volume_claim {
            claim_name = "mariadb-data"
          }
        }
      }
    }
  }
} */


/* 
output "kubeconfig_path" {
  value = local_file.kubeconfig.filename
} */
