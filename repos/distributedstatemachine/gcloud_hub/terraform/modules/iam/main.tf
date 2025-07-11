resource "google_service_account" "hub_service_account" {
  /* project = google_project.this.project_id */
  account_id = var.service_account_name
}

resource "google_project_iam_member" "hub_service_account_iam_member_secret_manager_admin" {
  /* project = google_project.this.project_id */

  role   = "roles/secretmanager.admin"
  member = "serviceAccount:${google_service_account.hub_service_account.email}"
}

resource "google_project_iam_member" "hub_service_account_iam_member_cluster_manager_admin" {
  /* project = google_project.this.project_id */

  role   = "roles/container.clusterAdmin"
  member = "serviceAccount:${google_service_account.hub_service_account.email}"
}


resource "google_project_iam_member" "hub_service_account_iam_member_cluster_manager_admin" {
  /* project = google_project.this.project_id */

  role   = "roles/container.clusterAdmin"
  member = "serviceAccount:${google_service_account.hub_service_account.email}"
}
# The creation of the binding was failing due to the nodes not being found.
# This 5 seconds sleeps fixes the issue.
resource "time_sleep" "wait_5_seconds" {
  depends_on = [google_container_node_pool.this]

  create_duration = "5s"
}

resource "google_service_account_iam_binding" "hub_service_account_iam_binding" {
  depends_on = [time_sleep.wait_5_seconds]

  service_account_id = google_service_account.hub_service_account.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "serviceAccount:${google_project.this.project_id}.svc.id.goog[${var.k8s_namespace}/${var.k8s_service_account}]",
  ]
}
