output "deployer_info" {
  description = "Information about the Deployer including KMS key"
  value =   {
    key_id    = aws_kms_key.deployer_key.key_id,
    key_alias = aws_kms_alias.deployer_alias.name
  }
}
