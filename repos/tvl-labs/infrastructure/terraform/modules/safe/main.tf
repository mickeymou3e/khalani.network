locals {
  app_name = "safe"
  chains   = ["godwokenmainnet", "godwokentestnet", "khalanitestnet"]
}

locals {
  db_name              = local.app_name
  db_username          = local.app_name
  django_auth_username = local.app_name
  service_account_name = local.app_name
}

resource "aws_security_group" "this" {
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_secretsmanager_random_password" "django_secret_passwords" {
  count = length(local.chains)

  password_length     = 60
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "django_secrets" {
  count = length(local.chains)

  name_prefix = "${local.app_name}-django-secret-${local.chains[count.index]}"
}

resource "aws_secretsmanager_secret_version" "django_secrets_versions" {
  count = length(local.chains)

  secret_id     = aws_secretsmanager_secret.django_secrets[count.index].id
  secret_string = "{\"password\":\"${data.aws_secretsmanager_random_password.django_secret_passwords[count.index].random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_policy" "django_secrets_policies" {
  count = length(local.chains)

  secret_arn = aws_secretsmanager_secret.django_secrets[count.index].arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

data "aws_secretsmanager_random_password" "txs_db_passwords" {
  count = length(local.chains)

  password_length     = 30
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "txs_db_secrets" {
  count = length(local.chains)

  name_prefix = "${local.app_name}-txs-database-secret-${local.chains[count.index]}"
}

resource "aws_secretsmanager_secret_version" "txs_db_secret_versions" {
  count = length(local.chains)

  secret_id     = aws_secretsmanager_secret.txs_db_secrets[count.index].id
  secret_string = "{\"username\":\"${local.db_username}\",\"password\":\"${data.aws_secretsmanager_random_password.txs_db_passwords[count.index].random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_db_instance" "txs" {
  count = length(local.chains)

  allocated_storage      = 50
  db_name                = "txsdb"
  engine                 = "postgres"
  engine_version         = "13.13"
  instance_class         = "db.t4g.small"
  password               = data.aws_secretsmanager_random_password.txs_db_passwords[count.index].random_password
  publicly_accessible    = true
  skip_final_snapshot    = true
  username               = local.db_username
  vpc_security_group_ids = [aws_security_group.this.id]

  lifecycle {
    ignore_changes = [password]
  }
}


data "aws_secretsmanager_random_password" "cfg_db_password" {
  password_length     = 30
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "cfg_db_secret" {
  name_prefix = "${local.app_name}-cfg-database-secret"
}

resource "aws_secretsmanager_secret_version" "cfg_db_secret_version" {
  secret_id     = aws_secretsmanager_secret.cfg_db_secret.id
  secret_string = "{\"username\":\"${local.db_username}\",\"password\":\"${data.aws_secretsmanager_random_password.cfg_db_password.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_db_instance" "cfg" {
  allocated_storage      = 50
  db_name                = local.db_name
  engine                 = "postgres"
  engine_version         = "13.13"
  instance_class         = "db.t4g.small"
  password               = data.aws_secretsmanager_random_password.cfg_db_password.random_password
  publicly_accessible    = true
  skip_final_snapshot    = true
  username               = local.db_username
  vpc_security_group_ids = [aws_security_group.this.id]

  lifecycle {
    ignore_changes = [password]
  }
}

module "irsa" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name = local.app_name

  oidc_providers = {
    ex = {
      provider_arn               = var.oidc_provider_arn
      namespace_service_accounts = ["${var.kubernetes_namespace}:${local.service_account_name}"]
    }
  }
}

resource "aws_secretsmanager_secret_policy" "txs_db_secret_policies" {
  count = length(local.chains)

  secret_arn = aws_secretsmanager_secret.txs_db_secrets[count.index].arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

resource "aws_secretsmanager_secret_policy" "cfg_db_secret_policy" {
  secret_arn = aws_secretsmanager_secret.cfg_db_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

data "aws_secretsmanager_random_password" "secret_key_password" {
  password_length     = 64
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "secret_key_secret" {
  name_prefix = "${local.app_name}-secret-key-secret"
}

resource "aws_secretsmanager_secret_version" "secret_key_secret_version" {
  secret_id     = aws_secretsmanager_secret.secret_key_secret.id
  secret_string = "{\"password\":\"${data.aws_secretsmanager_random_password.secret_key_password.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_policy" "secret_key_secret_policy" {
  secret_arn = aws_secretsmanager_secret.secret_key_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

data "aws_secretsmanager_random_password" "django_auth_password" {
  password_length     = 64
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "django_auth_secret" {
  name_prefix = "${local.app_name}-django-auth-secret"
}

resource "aws_secretsmanager_secret_version" "django_auth_secret_version" {
  secret_id     = aws_secretsmanager_secret.django_auth_secret.id
  secret_string = "{\"username\":\"${local.django_auth_username}\",\"password\":\"${data.aws_secretsmanager_random_password.django_auth_password.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_policy" "django_auth_secret_policy" {
  secret_arn = aws_secretsmanager_secret.django_auth_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

resource "aws_iam_user" "deployer" {
  name = "${local.app_name}-deployer"
}

resource "aws_iam_user_policy" "deployer_policy" {
  name = "${local.app_name}-deployer"
  user = aws_iam_user.deployer.name

  policy = templatefile("${path.module}/iam/distribution-policy.json",
    {
      distribution_arn = aws_cloudfront_distribution.this.arn
    }
  )
}

resource "aws_s3_bucket" "bucket" {
  bucket_prefix = local.app_name
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "bucket_controls" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "bucket_access_block" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = templatefile("${path.module}/iam/bucket-policy.json",
    {
      bucket_arn = aws_s3_bucket.bucket.arn
      user_arn   = aws_iam_user.deployer.arn
    }
  )
}

resource "aws_s3_bucket_website_configuration" "bucket_static" {
  bucket = aws_s3_bucket.bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

data "aws_secretsmanager_random_password" "cgw_webhook_flush_token" {
  password_length     = 30
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "cgw_webhook_flush_token_secret" {
  name_prefix = "${local.app_name}-cgw_webhook_flush_token"
}

resource "aws_secretsmanager_secret_version" "cgw_webhook_flush_token_secret_version" {
  secret_id     = aws_secretsmanager_secret.cgw_webhook_flush_token_secret.id
  secret_string = "{\"password\":\"${data.aws_secretsmanager_random_password.cgw_webhook_flush_token.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_policy" "cgw_webhook_flush_token_secret_policy" {
  secret_arn = aws_secretsmanager_secret.cgw_webhook_flush_token_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

data "aws_secretsmanager_random_password" "cgw_rocket_secret_key" {
  password_length     = 60
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "cgw_rocket_secret_key_secret" {
  name_prefix = "${local.app_name}-cgw_rocket_secret_key"
}

resource "aws_secretsmanager_secret_version" "cgw_rocket_secret_key_secret_version" {
  secret_id     = aws_secretsmanager_secret.cgw_rocket_secret_key_secret.id
  secret_string = "{\"password\":\"${data.aws_secretsmanager_random_password.cgw_rocket_secret_key.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_policy" "cgw_rocket_secret_key_secret_policy" {
  secret_arn = aws_secretsmanager_secret.cgw_rocket_secret_key_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.bucket_static.website_endpoint
    origin_id   = aws_s3_bucket.bucket.bucket_regional_domain_name

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

  aliases = ["safe-ui.${var.domain_name}"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    cache_policy_id  = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    target_origin_id = aws_s3_bucket.bucket.bucket_regional_domain_name

    compress               = true
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
  name    = "safe-ui.${var.domain_name}"
  type    = "A"
  zone_id = var.aws_hosted_zone_id

  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    evaluate_target_health = false
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
  }
}

resource "helm_release" "this" {
  name             = local.app_name
  chart            = "${path.root}/../helm/${local.app_name}"
  namespace        = var.kubernetes_namespace
  create_namespace = true
  force_update     = false

  values = [
    "${file("${path.root}/../helm/${local.app_name}/values.yaml")}"
  ]

  set {
    name  = "adminEmail"
    value = var.admin_email
  }

  set {
    name  = "serviceAccount.name"
    value = local.service_account_name
  }

  set {
    name  = "iamRoleArn"
    value = module.irsa.iam_role_arn
  }

  set {
    name  = "cfgDbHost"
    value = aws_db_instance.cfg.address
  }

  set {
    name  = "cfgDbSecretName"
    value = aws_secretsmanager_secret.cfg_db_secret.arn
  }

  set {
    name  = "djangoAuthSecretName"
    value = aws_secretsmanager_secret.django_auth_secret.arn
  }

  set {
    name  = "transactionsDatabases.godwokenmainnet.host"
    value = aws_db_instance.txs[0].address
  }

  set {
    name  = "transactionsDatabases.godwokenmainnet.secretName"
    value = aws_secretsmanager_secret.txs_db_secrets[0].arn
  }

  set {
    name  = "secrets.txsGodwokenMainnetDjangoSecretKey"
    value = aws_secretsmanager_secret.django_secrets[0].arn
  }

  set {
    name  = "transactionsDatabases.godwokentestnet.host"
    value = aws_db_instance.txs[1].address
  }

  set {
    name  = "transactionsDatabases.godwokentestnet.secretName"
    value = aws_secretsmanager_secret.txs_db_secrets[1].arn
  }

  set {
    name  = "secrets.txsGodwokenTestnetDjangoSecretKey"
    value = aws_secretsmanager_secret.django_secrets[1].arn
  }

  set {
    name  = "transactionsDatabases.khalanitestnet.host"
    value = aws_db_instance.txs[2].address
  }

  set {
    name  = "transactionsDatabases.khalanitestnet.secretName"
    value = aws_secretsmanager_secret.txs_db_secrets[2].arn
  }

  set {
    name  = "secrets.txsKhalaniTestnetDjangoSecretKey"
    value = aws_secretsmanager_secret.django_secrets[2].arn
  }

  set {
    name  = "secrets.cgwWebhookFlushToken"
    value = aws_secretsmanager_secret.cgw_webhook_flush_token_secret.arn
  }

  set {
    name  = "secrets.cgwRocketSecretKey"
    value = aws_secretsmanager_secret.cgw_rocket_secret_key_secret.arn
  }

  set {
    name  = "domainName"
    value = var.domain_name
  }

  set {
    name  = "rpcUrl"
    value = "https://testnet-trial.khalani.network"
  }

  set {
    name  = "secretKeySecretName"
    value = aws_secretsmanager_secret.secret_key_secret.arn
  }
}
