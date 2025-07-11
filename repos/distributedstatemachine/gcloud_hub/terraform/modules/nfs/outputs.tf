output "nfs_name" {
  description = "The name of the NFS"
  value       = google_filestore_instance.staging.name
}

output "filestore_instance" {
  description = "The filestore instance"
  value       = google_filestore_instance.staging.id
}

output "filestore_share_name" {
  description = "The name of the filestore share"
  value       = google_filestore_instance.staging.file_shares[0].name
}

output "filestore_ip_address" {
  description = "The IP address of the filestore"
  value       = google_filestore_instance.staging.networks[0].ip_addresses[0]
}
