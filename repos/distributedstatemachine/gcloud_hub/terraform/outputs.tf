/* output "cluster_name" {
  description = "The name of the GKE cluster"
  value       = module.gke.cluster_name
}
  *
output "cluster_location" {
  description = "The location of the GKE cluster"
  value       = google_container_cluster.primary.location
}

output "node_version" {
  value = google_container_cluster.primary.node_version
} */

output "machine" {
  value = module.gke.machine
}

/* 
output "machine" {
  value = module.gke.google_container_cluster.
} */
