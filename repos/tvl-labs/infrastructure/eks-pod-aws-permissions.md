# Configuring Amazon EKS Pod Access to AWS Resources

## Setting Up OIDC Provider

To enable Amazon EKS pod access to AWS resources, you need to create an OpenID Connect (OIDC) provider. Follow these steps:

1. Execute the command below to find the issuer URL:
   ```bash
   CLUSTER_NAME=axon-eks
   aws eks describe-cluster --name $CLUSTER_NAME --query cluster.identity.oidc
   ```
2. Check if there's an existing OIDC provider for your cluster in the [AWS IAM Console](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-east-1#/identity_providers). The "Provider" column corresponds to the "issuer" from the `cluster.identity.oidc` output.
   Example issuer:
   ```json
   {
       "issuer": "https://oidc.eks.us-east-1.amazonaws.com/id/32803539C78C654C14D84BD9DDB105D9"
   }
   ```
3. Ensure that `sts.amazonaws.com` is added as an audience in your OIDC configuration.
4. If your issuer is not listed, execute the following command to associate the OIDC provider:
   ```bash
   eksctl utils associate-iam-oidc-provider --region=us-east-1 --cluster=$CLUSTER_NAME --approve
   ```

## Creating IAM Role for Service Account using Terraform

IAM roles for Service Accounts are managed through Terraform declarations. Here's an example:

```hcl
locals {
  validator_roles = [for i in range(var.validator_count) : format("%s-hyperlane-validator-%d", var.validator_chain, i)]
}

resource "aws_iam_role" "validator_role" {
  count = var.validator_count
  name  = local.validator_roles[count.index]
  assume_role_policy = templatefile("${path.module}/iam/validator-role-trust-policy.json",
    {
      account_id      = var.account_id,
      service_account = "system:serviceaccount:hyperlane:${local.validator_roles[count.index]}",
      oidc_url        = var.oidc_url
    }
  )
}

resource "aws_kms_key" "validator_key" {
  policy = templatefile("${path.module}/iam/validator-kms-policy.json",
    {
      validator_arn = aws_iam_role.validator_role[count.index].arn
      account_id    = var.account_id
    }
  )
}
```

The `validator-kms-policy.json` template specifies resource-based permissions for the IAM role.

## Creating Service Account in Kubernetes and Assigning it to a Pod

Service Accounts are defined in Helm templates. Example `serviceaccount.yml`:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "safe.serviceAccountName" . }}
  annotations:
    eks.amazonaws.com/role-arn: {{ required "IAM role arn must be set in annotation" .Values.iamRoleArn }}
```

In the Helm values, set the IAM Role ARN:

```hcl
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
}
```

Ensure that the `serviceAccount` value is specified in the pod configuration:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: safe-txs-godwoken-mainnet
spec:
  replicas: 1
  serviceName: safe-txs-godwoken-mainnet
  template:
    spec:
      serviceAccountName: {{ include "safe.serviceAccountName" . }}
```

Deploy the service account and pod. The pod should now have access to `AWS_WEB_IDENTITY_TOKEN_FILE` and `AWS_ROLE_ARN`.

## Literature

1. [Diving into IAM Roles for Service Accounts](https://aws.amazon.com/blogs/containers/diving-into-iam-roles-for-service-accounts/)