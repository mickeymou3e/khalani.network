
// Creates the roles
resource "aws_iam_role" "bank_role" {
    name               = "khalani-bank"

  assume_role_policy = file("${path.module}/iam/bank-iam-role-policy.json")
}

// Creates the Ethereum Keys in KMS
resource "aws_kms_key" "bank_key" {
  description              = "khalani-bank"
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("${path.module}/iam/bank-kms-policy.json",
    {
      bank_arn   = aws_iam_role.bank_role.arn
      funding_bot_role_arn   = var.funding_bot_role_arn
      account_id = var.account_id
    }
  )
}

// Creates the aliases for the keys
resource "aws_kms_alias" "bank_alias" {
  name          = "alias/khalani-bank"
  target_key_id = aws_kms_key.bank_key.key_id
}

resource "aws_kms_grant" "kms_grant" {
  key_id            = aws_kms_key.bank_key.key_id
  grantee_principal = aws_iam_role.bank_role.arn
  operations        = ["GetPublicKey", "Sign"]
}


