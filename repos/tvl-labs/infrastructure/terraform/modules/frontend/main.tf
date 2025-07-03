locals {
  app_name = "khalani-frontend"
}

locals {
  applications_with_environments = flatten([for application in var.applications : [for environment in var.environments : "${application}.${environment}.${var.domain_name}"]])
}

resource "aws_iam_user" "deployer" {
  name = "${local.app_name}-deployer"
}

resource "aws_iam_user_policy" "deployer_policy" {
  count = length(local.applications_with_environments)
  name = "${local.applications_with_environments[count.index]}-deployer"
  user = aws_iam_user.deployer.name

  policy = templatefile("${path.module}/iam/distribution-policy.json",
    {
      distribution_arn = aws_cloudfront_distribution.this[count.index].arn
    }
  )
}

resource "aws_s3_bucket" "bucket" {
  count         = length(local.applications_with_environments)
  bucket_prefix = substr(local.applications_with_environments[count.index], 0, 37)
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "bucket_controls" {
  count = length(aws_s3_bucket.bucket)
  bucket = aws_s3_bucket.bucket[count.index].id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "bucket_access_block" {
  count = length(aws_s3_bucket.bucket)
  bucket = aws_s3_bucket.bucket[count.index].id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  count = length(aws_s3_bucket.bucket)
  bucket = aws_s3_bucket.bucket[count.index].id
  policy = templatefile("${path.module}/iam/bucket-policy.json",
    {
      bucket_arn = aws_s3_bucket.bucket[count.index].arn
      user_arn   = aws_iam_user.deployer.arn
    }
  )
}

resource "aws_s3_bucket_website_configuration" "bucket_static" {
  count = length(aws_s3_bucket.bucket)
  bucket = aws_s3_bucket.bucket[count.index].id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_cloudfront_distribution" "this" {
  count = length(local.applications_with_environments)

  origin {
    domain_name              = aws_s3_bucket_website_configuration.bucket_static[count.index].website_endpoint
    origin_id                = aws_s3_bucket.bucket[count.index].bucket_regional_domain_name

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only" 
      origin_read_timeout      = 30 
      origin_ssl_protocols     = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [local.applications_with_environments[count.index]]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    cache_policy_id  = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    target_origin_id = aws_s3_bucket.bucket[count.index].bucket_regional_domain_name

    compress = true
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.domain_certificate
    cloudfront_default_certificate = false
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = "sni-only"
  }
}

resource "aws_route53_record" "this" {
  count   = length(aws_cloudfront_distribution.this)
  name    = local.applications_with_environments[count.index]
  type    = "A"
  zone_id = var.aws_hosted_zone_id

  alias {
    name                   = aws_cloudfront_distribution.this[count.index].domain_name
    evaluate_target_health = false
    zone_id                = aws_cloudfront_distribution.this[count.index].hosted_zone_id
  }
}