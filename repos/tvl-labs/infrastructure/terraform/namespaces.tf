locals {
  namespaces = ["axon"]
}
resource "kubernetes_namespace" "axon" {
  for_each = toset(local.namespaces)
  metadata {
    name = each.key
  }
}