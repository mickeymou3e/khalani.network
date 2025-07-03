output "block_scout_info" {
  description = "Important information including IAM Roles, KMS Keys, database name, and secrets ARNs"
  value = {
    database = {
      name         = local.db_name,
      secret_arn   = aws_secretsmanager_secret.db_secret.arn,
      key_base_arn = aws_secretsmanager_secret.key_base_secret.arn
      identifier   = aws_db_instance.this.identifier
    }
  }
}
