resource "aws_security_group" "sg1" {
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_secretsmanager_random_password" "db_password" {
  password_length     = 30
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "db_secret" {
  name                    = "graph-node-database-secret-2"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "db_secret_version" {
  secret_id     = aws_secretsmanager_secret.db_secret.id
  secret_string = "{\"username\":\"graphnode\",\"password\":\"${data.aws_secretsmanager_random_password.db_password.random_password}\"}"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_db_instance" "this" {
  allocated_storage      = 400
  db_name                = "graphnode"
  engine                 = "postgres"
  engine_version         = "13.13"
  instance_class         = "db.t4g.small"
  password               = data.aws_secretsmanager_random_password.db_password.random_password
  publicly_accessible    = true
  skip_final_snapshot    = true
  username               = "graphnode"
  vpc_security_group_ids = [aws_security_group.sg1.id]

  lifecycle {
    ignore_changes = [password]
  }
}

resource "aws_iam_role" "graph_node_service_account_role" {
  name = "graph-node"
  assume_role_policy = templatefile("${path.module}/iam/role-trust-policy.json",
    {
      account_id      = var.account_id,
      service_account = "system:serviceaccount:${var.kubernetes_namespace}:${var.service_account_name}",
      oidc_url        = var.oidc_url
    }
  )
}

resource "aws_secretsmanager_secret_policy" "db_secret_policy" {
  secret_arn = aws_secretsmanager_secret.db_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = aws_iam_role.graph_node_service_account_role.arn
    }
  )
}

resource "aws_secretsmanager_secret_policy" "connection_urls_secret_policy" {
  secret_arn = var.connection_urls_secret
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = aws_iam_role.graph_node_service_account_role.arn
    }
  )
}

resource "aws_secretsmanager_secret_policy" "access_token_secret_policy" {
  secret_arn = aws_secretsmanager_secret.graph_access_token_secret.arn
  policy = templatefile("${path.module}/iam/secret-permissions.json",
    {
      role_arn = aws_iam_role.graph_node_service_account_role.arn
    }
  )
}

data "aws_secretsmanager_random_password" "graph_access_token_password" {
  password_length     = 40
  exclude_punctuation = true
}

resource "aws_secretsmanager_secret" "graph_access_token_secret" {
  name = "graph-node-access-token-secret-3"
}

resource "aws_secretsmanager_secret_version" "graph_access_token_secret_version" {
  secret_id = aws_secretsmanager_secret.graph_access_token_secret.id
  secret_string = templatefile("${path.module}/iam/access-config.json",
    {
      config = "{\\\"version\\\": \\\"v1\\\",\\\"tokens\\\": [{\\\"value\\\": \\\"${base64encode(data.aws_secretsmanager_random_password.graph_access_token_password.random_password)}\\\"}]}"
    }
  )

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "helm_release" "ipfs" {
  name             = "ipfs"
  chart            = "ipfs"
  repository       = "https://charts.truecharts.org/"
  namespace        = var.kubernetes_namespace
  create_namespace = true
}

resource "helm_release" "graph_node" {
  name             = "graph-node"
  chart            = "${path.root}/../helm/graph-node"
  namespace        = var.kubernetes_namespace
  create_namespace = true

  values = [
    "${file("${path.root}/../helm/graph-node/values.yaml")}"
  ]

  set {
    name  = "serviceAccountName"
    value = var.service_account_name
  }

  set {
    name  = "iamRoleArn"
    value = aws_iam_role.graph_node_service_account_role.arn
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
    name  = "domainName"
    value = var.domain_name
  }

  set {
    name  = "graphAccessTokenSecretName"
    value = aws_secretsmanager_secret.graph_access_token_secret.arn
  }
}
