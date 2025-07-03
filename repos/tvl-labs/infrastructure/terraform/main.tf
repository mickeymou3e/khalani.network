module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_vpn_gateway = false

  public_subnet_tags = {
    Name                                        = "axon-public-subnet"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
    "kubernetes.io/role/elb"                    = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
    "kubernetes.io/role/internal-elb"           = "1"
  }

  tags = {
    type = "production"
  }
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 18.0"
  cluster_name    = var.cluster_name
  cluster_version = "1.25"
  subnet_ids      = module.vpc.private_subnets

  vpc_id = module.vpc.vpc_id

  manage_aws_auth_configmap = false

  eks_managed_node_group_defaults = {
    ami_type                   = "AL2_x86_64"
    disk_size                  = var.disk_size
    instance_types             = var.instance_types
    iam_role_attach_cni_policy = true
  }

  eks_managed_node_groups = {
    default_node_group = {
      create_launch_template = false
      launch_template_name   = ""
      min_size               = var.min_size
      max_size               = var.max_size
      desired_size           = var.desired_size
      instance_types         = var.instance_types
      labels = {
        type = "development"
        Name = "dev-services-node"
      }
      remote_access = {
        ec2_ssh_key               = var.ec2_ssh_key
        source_security_group_ids = [aws_security_group.remote_access.id]
      }
    }
  }
}

module "ebs_csi_irsa_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name             = "ebs-csi"
  attach_ebs_csi_policy = true

  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }
}

resource "aws_eks_addon" "ebs-csi" {
  cluster_name             = module.eks.cluster_name
  addon_name               = "aws-ebs-csi-driver"
  addon_version            = "v1.18.0-eksbuild.1"
  service_account_role_arn = module.ebs_csi_irsa_role.iam_role_arn

  tags = {
    "eks_addon" = "ebs-csi"
    "terraform" = "true"
  }
}

module "axon-address" {
  source = "./modules/axon-address"
}

module "axon-node" {
  source = "./modules/axon-node"

  oidc_url = module.eks.oidc_provider
}

module "bank" {
  source               = "./modules/bank"
  funding_bot_role_arn = module.funding-bot.funding_bot_role_arn
}

module "deployer" {
  source = "./modules/deployer"
}

module "faucet" {
  source = "./modules/faucet"
}

module "funding-bot" {
  source = "./modules/funding-bot"

  account_id = var.account_id
  oidc_url   = module.eks.oidc_provider
}

module "hyperlane-godwoken-validator" {
  source = "./modules/hyperlane-validator"

  validator_chain = "godwoken-testnet"
  validator_count = var.validator_count
  account_id      = var.account_id
  oidc_url        = module.eks.oidc_provider
}

module "hyperlane-relayers" {
  source = "./modules/hyperlane-relayers"

  chains     = var.chains
  account_id = var.account_id
  oidc_url   = module.eks.oidc_provider
}

module "hyperlane-validator" {
  source = "./modules/hyperlane-validator"

  validator_chain = "khalani"
  validator_count = var.validator_count
  account_id      = var.account_id
  oidc_url        = module.eks.oidc_provider
}

module "graph-node" {
  source = "./modules/graph-node"

  account_id             = var.account_id
  connection_urls_secret = "arn:aws:secretsmanager:us-east-1:803035318642:secret:khalani/testnet/graph-connection-urls-ZYafL6"
  domain_name            = "testnet.${var.domain_name}"
  kubernetes_namespace   = "graph-node"
  oidc_url               = module.eks.oidc_provider
  service_account_name   = "graph-node"
}

module "external_dns_irsa_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name                     = "external-dns"
  attach_external_dns_policy    = true
  external_dns_hosted_zone_arns = ["arn:aws:route53:::hostedzone/${var.aws_hosted_zone_id}"]

  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-addons:external-dns"]
    }
  }
}

locals {
  load_balancer_role_name = "aws-load-balancer-controller"
  load_balancer_namespace = "kube-system"
}

module "load_balancer_irsa_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name                              = local.load_balancer_role_name
  attach_load_balancer_controller_policy = true

  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["${local.load_balancer_namespace}:${local.load_balancer_role_name}"]
    }
  }
}

resource "helm_release" "aws-load-balancer-controller" {
  name             = "aws-load-balancer-controller"
  chart            = "aws-load-balancer-controller"
  version          = "1.5.4"
  repository       = "https://aws.github.io/eks-charts"
  namespace        = local.load_balancer_namespace
  create_namespace = true

  set {
    name  = "clusterName"
    value = module.eks.cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = true
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.load_balancer_irsa_role.iam_role_arn
  }

  set {
    name  = "serviceAccount.name"
    value = module.load_balancer_irsa_role.iam_role_name
  }
}

resource "helm_release" "ingress-nginx" {
  name             = "ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.7.1"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  namespace        = "ingress-nginx"
  create_namespace = true

  set {
    name  = "controller.service.targetPorts.http"
    value = "http"
  }

  set {
    name  = "controller.service.targetPorts.https"
    value = "http"
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-ssl-cert"
    value = var.domain_certificate
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-backend-protocol"
    value = "http"
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-ssl-ports"
    value = "https"
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-connection-idle-timeout"
    value = "3600"
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-scheme"
    value = "internet-facing"
  }
}

resource "helm_release" "external_dns" {
  name             = "external-dns"
  chart            = "external-dns"
  version          = "6.20.4"
  repository       = "https://charts.bitnami.com/bitnami"
  namespace        = "kube-addons"
  create_namespace = true

  set {
    name  = "txtOwnerId"
    value = var.aws_hosted_zone_id
  }

  set {
    name  = "domainFilters[0]"
    value = var.domain_name
  }

  set {
    name  = "serviceAccount.name"
    value = module.external_dns_irsa_role.iam_role_name
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.external_dns_irsa_role.iam_role_arn
  }

  set {
    name  = "provider"
    value = "aws"
  }

  set {
    name  = "podSecurityContext.fsGroup"
    value = 65534
  }

  set {
    name  = "podSecurityContext.runAsUser"
    value = 0
  }
}

resource "helm_release" "reloader" {
  name             = "reloader"
  chart            = "reloader"
  version          = "1.0.29"
  repository       = "https://stakater.github.io/stakater-charts"
  namespace        = "kube-addons"
  create_namespace = true
}

module "blockscout" {
  source = "./modules/blockscout"

  domain_name          = "testnet.${var.domain_name}"
  kubernetes_namespace = "blockscout"
  oidc_provider_arn    = module.eks.oidc_provider_arn
}

module "frontend" {
  source = "./modules/frontend"

  aws_hosted_zone_id = var.aws_hosted_zone_id
  domain_certificate = var.domain_certificate
  domain_name        = var.domain_name
  applications       = ["app", "cross-chain-explorer"]
  environments       = ["testnet", "staging"]
}

module "safe" {
  source = "./modules/safe"

  admin_email          = var.admin_email
  aws_hosted_zone_id   = var.aws_hosted_zone_id
  domain_certificate   = var.domain_certificate
  domain_name          = var.domain_name
  kubernetes_namespace = "applications"
  oidc_provider_arn    = module.eks.oidc_provider_arn
}

module "solvers" {
  source     = "./modules/solvers"
  account_id = var.account_id
  oidc_url   = module.eks.oidc_provider
}
