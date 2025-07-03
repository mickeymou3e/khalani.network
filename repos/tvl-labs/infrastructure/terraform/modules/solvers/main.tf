// Creates the solver roles 
resource "aws_iam_role" "solver_role" {
  for_each = toset(var.solver_roles)

  name     = each.value
  assume_role_policy = templatefile("${path.module}/iam/solver-role-trust-policy.json",
    {
      account_id      = var.account_id,
      service_account = "system:serviceaccount:applications:${each.value}",
      oidc_url        = var.oidc_url
    }
  )
}

// Creates the policy
resource "aws_iam_policy" "solver_secrets_policy" {
  for_each = toset(var.solver_roles)

  name        = "${each.value}_secrets_policy"
  description = "Policy to allow access to specific secrets in Secrets Manager"
  policy = templatefile("${path.module}/iam/solver-secrets-manager-policy.json", {})
}

// Attaches the policy to the role
resource "aws_iam_role_policy_attachment" "solver_secrets_policy_attachment" {
  for_each = toset(var.solver_roles)

  role       = aws_iam_role.solver_role[each.value].name
  policy_arn = aws_iam_policy.solver_secrets_policy[each.value].arn
}

// Creates the Ethereum Key in KMS
resource "aws_kms_key" "_key" {
  for_each = toset(var.solver_roles)

  description              = each.value
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("${path.module}/iam/solver-kms-policy.json"
    , {
      solver_arn = aws_iam_role.solver_role[each.value].arn
      account_id  = var.account_id
    }
  )
}

// Creates the alias for the solver key
resource "aws_kms_alias" "solver_alias" {
  for_each = toset(var.solver_roles)

  name          = "alias/${each.value}"
  target_key_id = aws_kms_key._key[each.value].key_id
}