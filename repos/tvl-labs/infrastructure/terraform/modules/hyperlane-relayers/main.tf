locals {
  relayer_roles = [for chain in var.chains : format("khalani-hyperlane-relayer-%s", chain)]
  relayer_keys  = [for chain in var.chains : format("alias/khalani-hyperlane-relayer-signer-%s", chain)]
}

// Creates the roles 
resource "aws_iam_role" "relayer_role" {
  for_each = toset(local.relayer_roles)
  name     = each.key
  assume_role_policy = templatefile("${path.module}/iam/relayer-role-trust-policy.json",
    {
      account_id      = var.account_id,
      service_account = "system:serviceaccount:hyperlane:${each.key}",
      oidc_url         = var.oidc_url
    }
  )
}

// Creates the Ethereum Keys in KMS
resource "aws_kms_key" "relayer_key" {
  for_each                 = toset(local.relayer_roles)
  description              = each.key
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("${path.module}/iam/relayer-kms-policy.json"
    , {
      relayer_arn = aws_iam_role.relayer_role[each.key].arn
      account_id  = var.account_id
    }
  )
    lifecycle {
    ignore_changes = [policy]
  }

}

// Creates the aliases for the relayer keys
resource "aws_kms_alias" "relayer_alias" {
  for_each      = toset(local.relayer_roles)
  name          = "alias/${each.key}"
  target_key_id = aws_kms_key.relayer_key[each.key].key_id
}
