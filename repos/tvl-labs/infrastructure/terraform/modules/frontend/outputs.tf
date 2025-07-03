output "deployer_iam_user" {
  value = aws_iam_user.deployer.name
}

output "applications_with_environments_info" {
  value = [
    for index, application in local.applications_with_environments: {
      bucket_id       = aws_s3_bucket.bucket[index].arn
      distribution_id = aws_cloudfront_distribution.this[index].arn
    }
  ]
}