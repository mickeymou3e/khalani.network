# TODO create the secrets here and attach the role directly

// Creates the roles 
resource "aws_iam_role" "validator_role" {
  name  = "axon-node"
  assume_role_policy = templatefile("${path.module}/iam/axon-node-role-trust-policy.json",
    {
      account_id      = var.account_id,
      service_account = "system:serviceaccount:axon:axon-node",
      oidc_url        = var.oidc_url
    }
  )
}
