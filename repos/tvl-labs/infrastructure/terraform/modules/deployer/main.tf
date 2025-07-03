// Creates the Ethereum Keys in KMS
resource "aws_kms_key" "deployer_key" {
  description              = "khalani-deployer"
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_SECG_P256K1"
  policy = templatefile("${path.module}/iam/deployer-kms-policy.json",
    {
      account_id = var.account_id
    }
  )
}

// Creates the aliases for the keys
resource "aws_kms_alias" "deployer_alias" {
  name          = "alias/khalani-deployer"
  target_key_id = aws_kms_key.deployer_key.key_id
}

// Creates the roles 
data "aws_ssoadmin_instances" "this" {}
data "aws_identitystore_group" "this" {
  identity_store_id = tolist(data.aws_ssoadmin_instances.this.identity_store_ids)[0]

  alternate_identifier {
    unique_attribute {
      attribute_path  = "DisplayName"
      attribute_value = var.group_name
    }
  }
}

resource "aws_ssoadmin_permission_set" "this" {
  name             = "TVLSmartContractDeployer"
  instance_arn     = tolist(data.aws_ssoadmin_instances.this.arns)[0]
  session_duration = "PT12H"
}

data "aws_iam_policy_document" "deployer_kms_read" {
  statement {
    sid = "0"
    actions = [
      "kms:GetPublicKey",
      "kms:Sign"
    ]
    resources = [
      aws_kms_key.deployer_key.arn
    ]
  }
}

resource "aws_ssoadmin_permission_set_inline_policy" "this" {
  inline_policy      = data.aws_iam_policy_document.deployer_kms_read.json
  instance_arn       = aws_ssoadmin_permission_set.this.instance_arn
  permission_set_arn = aws_ssoadmin_permission_set.this.arn
}

data "aws_organizations_organization" "this" {}

resource "aws_ssoadmin_account_assignment" "this" {
  for_each           = toset(data.aws_organizations_organization.this.accounts[*].id)
  instance_arn       = aws_ssoadmin_permission_set.this.instance_arn
  permission_set_arn = aws_ssoadmin_permission_set.this.arn
  principal_id       = data.aws_identitystore_group.this.group_id
  principal_type     = "GROUP"
  target_id          = sensitive(each.value)
  target_type        = "AWS_ACCOUNT"
}
