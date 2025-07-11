locals {
  app_name    = "optimism"
}

locals {
  service_account_name = local.app_name
}

module "irsa" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name                      = local.app_name

  oidc_providers = {
    ex = {
      provider_arn               = var.oidc_provider_arn
      namespace_service_accounts = ["${var.kubernetes_namespace}:${local.service_account_name}"]
    }
  }
}

resource "aws_secretsmanager_secret_policy" "secret_policy" {  
  secret_arn = "arn:aws:secretsmanager:us-east-1:803035318642:secret:khalanitestnet/optimism-z8YDA4"
  policy     = templatefile("${path.module}/iam/secret-permissions.json",
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
  force_update     = false
  
  values = [
    "${file("${path.root}/../helm/${local.app_name}/values.yaml")}"
  ]

  set {
    name  = "serviceAccount.name"
    value = local.service_account_name
  }

  set {
    name  = "iamRoleArn"
    value = module.irsa.iam_role_arn
  }

  set {
    name  = "secretName"
    value = "khalanitestnet/optimism"
  }
  
  set {
    name  = "domainName"
    value = var.domain_name
  }
}