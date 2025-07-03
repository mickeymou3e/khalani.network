output "validator_info" {
  description = "Information about the Validators, including their IAM roles, KMS keys, and S3 buckets"
  value = [for i in range(var.validator_count) : {
    role_name   = aws_iam_role.validator_role[i].name,
    role_arn    = aws_iam_role.validator_role[i].arn,
    bucket_name = aws_s3_bucket.bucket[i].bucket,
    key_id      = aws_kms_key.validator_key[i].key_id,
    key_alias   = aws_kms_alias.validator_alias[i].name
  }]
}
