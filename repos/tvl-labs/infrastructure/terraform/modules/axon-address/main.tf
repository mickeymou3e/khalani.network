// VALIDATORS

// Use locals to store logic for creating roles , key aliases and s3 buckets
locals {
  axon_roles = [for i in range(var.address_count) : format("khalani-axon-address-%d", i)]
  axon_keys  = [for i in range(var.address_count) : format("alias/khalani-axon-key-%d", i)]
}


// Creates the roles 
resource "aws_iam_role" "axon_role" {
  count              = var.address_count
  name               = local.axon_roles[count.index]
  assume_role_policy = file("${path.module}/iam/axon-iam-role-policy.json")
}

// Creates the Ethereum Keys in KMS
resource "aws_kms_key" "axon_key" {
  count                    = var.address_count
  description              = local.axon_keys[count.index]
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("${path.module}/iam/axon-kms-policy.json",
    {
      axon_arn   = aws_iam_role.axon_role[count.index].arn
      account_id = var.account_id
    }
  )
}

// Creates the aliases for the keys
resource "aws_kms_alias" "axon_alias" {
  count         = var.address_count
  name          = local.axon_keys[count.index]
  target_key_id = aws_kms_key.axon_key[count.index].key_id
}

resource "aws_kms_grant" "kms_grant" {
  count             = var.address_count
  key_id            = aws_kms_key.axon_key[count.index].key_id
  grantee_principal = aws_iam_role.axon_role[count.index].arn
  operations        = ["GetPublicKey", "Sign"]
}


