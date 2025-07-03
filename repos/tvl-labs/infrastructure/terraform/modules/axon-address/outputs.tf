output "address_info" {
  description = "Information about the Validators, including their IAM roles, KMS keys, and S3 buckets"
  value = [for i in range(var.address_count) : {
    role_name = aws_iam_role.axon_role[i].name,
    role_arn  = aws_iam_role.axon_role[i].arn,
    key_id    = aws_kms_key.axon_key[i].key_id,
    key_alias = aws_kms_alias.axon_alias[i].name
  }]
}
