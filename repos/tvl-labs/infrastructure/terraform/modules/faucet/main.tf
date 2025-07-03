resource "aws_kms_key" "faucet" {
  description              = "KMS key for the faucet wallet"
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy                   = templatefile("${path.module}/iam/faucet-kms-policy.json", {
    role_arn = var.role_arn,
    root_arn = var.root_arn
  })
}
