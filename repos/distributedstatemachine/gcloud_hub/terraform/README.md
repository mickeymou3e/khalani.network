# Terraform

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

- Backend for state files

```shell
gcloud storage buckets create gs://ekzl-hub-tf-state --location=us-central1
```

- Add the storage bucket to the `main.tf` file in the root directory

```shell
terraform {
  backend "gcs" {
    bucket = "ekzl-hub-tf-state-production"
    prefix = "terraform/state"
  }
}
```

- Run `terraform init`


- List workspaces 

```
terraform workspace list

```

- Pull `kubeconfig`

```shell
gcloud container clusters get-credentials hub-staging --zone us-central1 --project civil-lambda-374300
```
