locals {
  app_name = "blockscout"
}

locals {
  db_identifier_suffix = random_integer.db_identifier_suffix.result
  db_name              = local.app_name
  db_username          = local.app_name
  service_account_name = local.app_name
}

resource "random_integer" "db_identifier_suffix" {
  min = 1000
  max = 9999
}

resource "aws_security_group" "this" {
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_secretsmanager_random_password" "key_base_password" {
  password_length     = 64
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "key_base_secret" {
  name_prefix = "${local.app_name}-key-base-secret"
}

resource "aws_secretsmanager_secret_version" "key_base_secret_version" {
  secret_id     = aws_secretsmanager_secret.key_base_secret.id
  secret_string = "{\"password\":\"${data.aws_secretsmanager_random_password.key_base_password.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_policy" "key_base_secret_policy" {
  secret_arn = aws_secretsmanager_secret.key_base_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

data "aws_secretsmanager_random_password" "db_password" {
  password_length     = 30
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "db_secret" {
  name_prefix = "${local.app_name}-database-secret-3"
}

resource "aws_secretsmanager_secret_version" "db_secret_version" {
  secret_id     = aws_secretsmanager_secret.db_secret.id
  secret_string = "{\"username\":\"${local.db_username}\",\"password\":\"${data.aws_secretsmanager_random_password.db_password.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_db_instance" "this" {
  allocated_storage      = 80
  db_name                = local.db_name
  engine                 = "postgres"
  engine_version         = "13.13"
  instance_class         = "db.t4g.small"
  password               = data.aws_secretsmanager_random_password.db_password.random_password
  publicly_accessible    = true
  skip_final_snapshot    = true
  username               = local.db_username
  vpc_security_group_ids = [aws_security_group.this.id]
  identifier             = "${local.db_name}-${local.db_identifier_suffix}"


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

resource "aws_secretsmanager_secret_policy" "db_secret_policy" {
  secret_arn = aws_secretsmanager_secret.db_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = module.irsa.iam_role_arn
    }
  )
}

resource "helm_release" "this" {
  name             = local.app_name
  chart            = "${path.root}/../helm/${local.app_name}"
  namespace        = var.kubernetes_namespace
  create_namespace = true

  values = [
    "${file("${path.root}/../helm/${local.app_name}/values.yaml")}"
  ]

  set {
    name  = "serviceAccountName"
    value = local.service_account_name
  }

  set {
    name  = "iamRoleArn"
    value = module.irsa.iam_role_arn
  }

  set {
    name  = "postgresHost"
    value = aws_db_instance.this.address
  }

  set {
    name  = "dbSecretName"
    value = aws_secretsmanager_secret.db_secret.arn
  }

  set {
    name  = "keyBaseSecretName"
    value = aws_secretsmanager_secret.key_base_secret.arn
  }

  set {
    name  = "domainName"
    value = var.domain_name
  }

  set {
    name  = "rpcUrl"
    value = "https://testnet-trial.khalani.network"
  }
}

output "database_name" {
  value       = local.db_name
  description = "The name of the database"
}

