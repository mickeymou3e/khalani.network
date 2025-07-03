# Terraform Deployment

## Prerequisites 

### Download Terraform

Terraform is required to run this. It can be installed [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).

### Create Terraform Backend for state

Terraform requires a remote storage medium in order to be able to store state. For this , we will use AWS s3. In order to create this , we will run the following command in the AWS CLI. Please note that names in s3 have to be globally unique. 

```shell
aws s3api create-bucket --bucket unified-terraform-state --region us-east-1

{
    "Location": "/unified-terraform-state"
}

```

### Create Graph Node configuration secret with RPC URLs

Create a secret in AWS Secrets Manager with name: `khalani/testnet/graph-connection-urls` and following schema/value:
```
{"Chain1Name":"khalanitestnet","Chain1RpcUrl":"https://testnet.khalani.network","Chain2Name":"sepolia","Chain2RpcUrl":"https://sepolia.infura.io/v3/xyz","Chain3Name":"fuji","Chain3RpcUrl":"https://avalanche-fuji.infura.io/v3/xyz"}
```

Copy created secret ARN and use it as `connection_urls_secret` variable that is passed to `module.graph-node`. Example:
```
module "graph-node" {
  // ...
  connection_urls_secret     = "arn:aws:secretsmanager:us-east-1:803035318642:secret:khalani/testnet/graph-connection-urls-ZYafL6"
}
```

## Deployment

### Initialize Terraform

```shell
 terraform init

Initializing the backend...

Initializing provider plugins...
- Finding latest version of hashicorp/aws...
- Installing hashicorp/aws v4.67.0...
- Installed hashicorp/aws v4.67.0 (signed by HashiCorp)
```

### Plan the deployment 

```shell
terraform plan
```

### Execute the plan

Once you have reviewed the plan and are happy with it , run 

```shell
terraform apply
```

The plan would be printed on screen again , and you will be prompt to execute it.


If the run is successful , we you should see the following output

### Write variable to disk


In order to store the output of the execution, run

```shell
./generate_outputs.sh
```
