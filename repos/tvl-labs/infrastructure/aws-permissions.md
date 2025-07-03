# AWS permissions

## Groups

We mainly try to use IAM Identity Centre for managing user permissions and putting them into groups.

In TVL we have three groups where people can belong in terms of AWS permissions:

1. TVL Administrator
2. TVL Developer
3. TVL Smart Contract Deployer

These groups are configured in IAM Identity Centre. You need to create them through the AWS Web Console UI. You also need to assign users to them manually there.

### Administrator

TVL Administrator group has attached AWS managed permission policy "AdministratorAccess", meaning it has full access to everything, including EKS cluster axon-eks. It will be explained later how this works.

### Developer

TVL Developer group has custom policy attached. At the moment of creation, it can only describe EKS cluster axon-eks and nothing else.

### Smart Contract Deployer

This role is supposed to be used by a smart contract developer that needs to interact with KMS key to deploy contracts. For this role you don't need to assume any roles - it is enough that you're added to this group and then when you use it you will immediately have access to its permissions.

## Setting up permissions

For Administrator and Developer right now permissions have been configured manually. For Deployer - after you have created a group you can use Terraform to set permissions of this group. Make sure that `terraform/modules/deployer/variables.tf` file group_name variable matches the group name in IAM Identity Center.

```
cd terraform
terraform init
terraform plan -target=module.deployer
```

## Assuming roles

Assumption of the AWS role means that you as a user who already has some role, you assume another role (like an actor) and receive temporary credentials to play this role.

The IAM Identity Centre roles that have provisioned permissions are mirrored in classic IAM as IAM roles. These SSO (IAM Identity Centre) roles are configured to be able to assume normal IAM roles when needed for specific services - eg. EKS cluster. This is done by configuring trust policies of classic IAM roles to allow SSO roles to assume them, example policy of k8sDev (can be assumed both by administrator and developer):
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::803035318642:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_TVLDeveloper_8d84bf6bcbe4fab4"
            },
            "Action": "sts:AssumeRole",
            "Condition": {}
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::803035318642:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AdministratorAccess_bd29caed9773b54e"
            },
            "Action": "sts:AssumeRole",
            "Condition": {}
        }
    ]
}
```

## AWS CLI credentials

We use IAM Identity Centre and as part of onboarding every user should have received an email which contains a link to the portal where they should login. After you login to that portal you can obtain credentials required for setting up AWS CLI.

If you setup the CLI according to this tutorial you will have auto assumption of the roles configured which is extremely handy. 

Example AWS portal URL: https://d-9067b9f3d0.awsapps.com/start/

1. Login
2. Click AWS Account (1)
3. Click tunnelvisionlabs.xyz
4. Click "Command line or programmatic access"
5. Copy the credentials to your `~/.aws/credentials` file so it looks like:
```
[default]
aws_access_key_id=X
aws_secret_access_key=Y
aws_session_token=Z
```

Note: you will have to repeat step 5 again after session is expired (eg. current time 12 hours).

6. Create `~/.aws/config` file. If you're a developer (not administrator) use this content:
```
[default]
region = us-east-1
output = json

[profile k8sdev]  
role_arn=arn:aws:iam::803035318642:role/k8sDev  
source_profile=default
region = us-east-1
output = json
```

If you're an administrator use this content:
```
[default]
region = us-east-1
output = json

[profile k8sadmin]
role_arn=arn:aws:iam::803035318642:role/k8sAdmin
source_profile=default
region = us-east-1
output = json

[profile k8sdev]
role_arn=arn:aws:iam::803035318642:role/k8sDev
source_profile=default
region = us-east-1
output = json
```

Now if you want to execute AWS CLI or eksctl command and assume k8sadmin or k8sdev role just use them as a profile, for example:
```
aws eks update-kubeconfig --name axon-eks --region us-east-1 --profile k8sdev
```

AWS will automatically assume the role and store cached credentials in `.aws/cli/cache`. Sometimes it is useful to delete this folder to refresh account cache, for example after permission changes of the roles.

**Remember you only need to assume roles for services that require it! In many cases you may want to omit profile flag and use the default profile instead!**

## EKS integration

As we said before we have two groups in AWS. These AWS groups have different permissions inside axon-eks cluster. It is accomplished by the creation of the intermediary AWS roles that can be assumed: k8sAdmin and k8sDev.

1. k8sAdmin - belongs to "system:masters" k8s group - meaning it has full administrator access inside the cluster.
2. k8sDev - mapped to "dev" username, this username has a ClusterRoleBinding to be able to have some cluster-wide read-only access. [Developer role configuration can be found here.](./axon-eks-permissions/dev-role.yml)

IAMIdentityMapping table inside the cluster:
<img width="1191" alt="image" src="https://user-images.githubusercontent.com/4950658/233659735-b133136b-2491-461f-9419-a4491015cc9a.png">

TVL Administrator AWS group members can assume both k8sAdmin and k8sDev roles.

TVL Developer can only assume k8sDev role.

### Configuring EKS pod access to AWS resources

[Read.](./eks-pod-aws-permissions.md)

### Configuring EKS pod access to AWS Secrets Manager

[Read.](./eks-pod-secrets-manager.md)

## Handy EKS commands

If you configured everything as stated above you can find these commands handy:

Connect to cluster as developer:
```
aws eks update-kubeconfig --name axon-eks --region us-east-1 --profile k8sdev
```

Connect to cluster as administrator:
```
aws eks update-kubeconfig --name axon-eks --region us-east-1 --profile k8sadmin
```

Test assuming roles directly as developer:
```
aws sts assume-role --role-arn arn:aws:iam::803035318642:role/k8sDev --role-session-name k8sDev
```

Test assuming roles directly as administrator:
```
aws sts assume-role --role-arn arn:aws:iam::803035318642:role/k8sAdmin --role-session-name k8sAdmin
```

Fetch IAMIdentityMapping as administrator:
```
eksctl get iamidentitymapping --cluster axon-eks --region us-east-1 --profile k8sadmin
```

Delete a mapping:
```
eksctl delete iamidentitymapping --cluster axon-eks --region us-east-1 --arn arn:aws:iam::803035318642:role/k8sDev --profile k8sadmin
```

Create a mapping:
```
eksctl create iamidentitymapping --cluster axon-eks --region us-east-1 --arn arn:aws:iam::803035318642:role/k8sDev --username dev --profile k8sadmin
```

## Literature

1. https://archive.eksworkshop.com/beginner/091_iam-groups/configure-aws-auth/
2. https://kubernetes.io/docs/reference/access-authn-authz/rbac/