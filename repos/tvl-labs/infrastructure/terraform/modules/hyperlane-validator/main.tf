// VALIDATORS

// Use locals to store logic for creating roles , key aliases and s3 buckets
locals {
  validator_roles   = [for i in range(var.validator_count) : format("%s-hyperlane-validator-%d", var.validator_chain, i)]
  validator_keys    = [for i in range(var.validator_count) : format("alias/%s-hyperlane-validator-signer-%d", var.validator_chain, i)]
  validator_buckets = [for i in range(var.validator_count) : format("%s-validator-signatures-%d", var.validator_chain, i)]
}

// Creates the roles
resource "aws_iam_role" "validator_role" {
  count = var.validator_count
  name  = local.validator_roles[count.index]
  assume_role_policy = templatefile("${path.module}/iam/validator-role-trust-policy.json",
    {
      account_id      = var.account_id,
      service_account = "system:serviceaccount:hyperlane:${local.validator_roles[count.index]}",
      oidc_url        = var.oidc_url
    }
  )
}

// Creates the Ethereum Keys in KMS
resource "aws_kms_key" "validator_key" {
  count                    = var.validator_count
  description              = local.validator_keys[count.index]
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("${path.module}/iam/validator-kms-policy.json",
    {
      validator_arn = aws_iam_role.validator_role[count.index].arn
      account_id    = var.account_id
    }
  )
    lifecycle {
    ignore_changes = [policy]
  }
}

// Creates the aliases for the keys
resource "aws_kms_alias" "validator_alias" {
  count         = var.validator_count
  name          = local.validator_keys[count.index]
  target_key_id = aws_kms_key.validator_key[count.index].key_id
}

// Creates the s3 buckets
resource "aws_s3_bucket" "bucket" {
  count  = var.validator_count
  bucket = local.validator_buckets[count.index]
}

// Adds public access block to the buckets
resource "aws_s3_bucket_public_access_block" "s3_public_access_block" {
  count                   = var.validator_count
  bucket                  = local.validator_buckets[count.index]
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

// Adds bucket policy to the buckets
resource "aws_s3_bucket_policy" "bucket_policy" {
  count  = var.validator_count
  bucket = aws_s3_bucket.bucket[count.index].id
  policy = templatefile("${path.module}/iam/validator-s3-policy.json"
    , {
      validator_bucket_arn = aws_s3_bucket.bucket[count.index].arn,
      validator_role_arn   = aws_iam_role.validator_role[count.index].arn
    }
  )
    lifecycle {
    ignore_changes = [policy]
  }
}

