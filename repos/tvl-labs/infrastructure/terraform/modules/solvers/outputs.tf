output "solver_info" {
  description = "The ARNs of the solver IAM Roles, and their corresponding KMS Keys and Aliases"
  value = { for solver in var.solver_roles : solver => {
    role_name = aws_iam_role.solver_role[solver].name,
    role_arn  = aws_iam_role.solver_role[solver].arn,
    key_id    = aws_kms_key._key[solver].key_id,
    key_alias = aws_kms_alias.solver_alias[solver].name
  }}
}