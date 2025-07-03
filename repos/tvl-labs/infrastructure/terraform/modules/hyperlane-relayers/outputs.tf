output "relayer_info" {
  description = "The ARNs of the Relayers IAM Roles, and their corresponding KMS Keys and Aliases"
  value = [for i in keys(aws_iam_role.relayer_role) : {
    role_name = aws_iam_role.relayer_role[i].name,
    role_arn  = aws_iam_role.relayer_role[i].arn,
    key_id    = aws_kms_key.relayer_key[i].key_id,
    key_alias = aws_kms_alias.relayer_alias[i].name
  }]
}

