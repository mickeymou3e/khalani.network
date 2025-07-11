resource "google_filestore_instance" "staging" {
  name     = var.nfs_name
  tier     = var.nfs_tier
  location = var.nfs_zone

  file_shares {
    capacity_gb = var.file_share_capacity_gb
    name        = var.file_share_name
  }

  networks {
    network = var.vpc_name
    modes   = var.nfs_network_modes
  }

  /* depends_on = [var.vpc_input] */
}
