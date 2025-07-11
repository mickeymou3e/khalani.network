data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

// Use locals to store logic for creating roles , key aliases and s3 buckets
locals {
  axon_roles = [for i in range(var.address_count) : format("liquidator-address-%d", i)]
  axon_keys  = [for i in range(var.address_count) : format("alias/liqudator-key-%d", i)]
}

resource "aws_instance" "axon" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.access_key

  tags = {
    Name = "main"
  }
}


// VALIDATORS

// Creates the roles 
resource "aws_iam_role" "axon_role" {
  count              = var.address_count
  name               = local.axon_roles[count.index]
  assume_role_policy = file("./iam/iam-role-policy.json")
}

// Creates the Ethereum Keys in KMS
resource "aws_kms_key" "axon_key" {
  count                    = var.address_count
  description              = local.axon_keys[count.index]
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("./kms-policy.json",
    {
      axon_arn   = aws_iam_role.axon_role[count.index].arn
      account_id = var.account_id
    }
  )
}

// Creates the aliases for the keys
resource "aws_kms_alias" "axon_alias" {
  count         = var.address_count
  name          = local.axon_keys[count.index]
  target_key_id = aws_kms_key.axon_key[count.index].key_id
}

resource "aws_kms_grant" "kms_grant" {
  count             = var.address_count
  key_id            = aws_kms_key.axon_key[count.index].key_id
  grantee_principal = aws_iam_role.axon_role[count.index].arn
  operations        = ["GetPublicKey", "Sign"]
}
