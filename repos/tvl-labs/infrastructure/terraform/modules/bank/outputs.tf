output "bank_info" {
  description = "Information about the bank, including their IAM roles, KMS keys"
  value =   {
    role_name = aws_iam_role.bank_role.name,
    role_arn  = aws_iam_role.bank_role.arn,
    key_id    = aws_kms_key.bank_key.key_id,
    key_alias = aws_kms_alias.bank_alias.name
  }
}
