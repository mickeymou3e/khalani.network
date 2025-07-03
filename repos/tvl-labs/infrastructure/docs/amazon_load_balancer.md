# AWS Load Balancer 

This document covers instructions for setting up the AWS Load Balancer in our Kubernetes Cluster

## Prerequisites 

### Amazon VPC CNI

Run to check if you have the Amazon VPC CNI

```shell
aws eks describe-addon --cluster-name axon-eks --addon-name vpc-cni --query addon.addonVersion --output text

An error occurred (ResourceNotFoundException) when calling the DescribeAddon operation: No addon: vpc-cni found in cluster: axon-eks
```

### Save current Configuration of the adds-ons

Run

```shell
kubectl get daemonset aws-node -n kube-system -o yaml > eks-universal/aws-k8s-cni-old.yaml
```

### Create the add-on

To create the add-on , run 

```shell
aws eks create-addon --cluster-name axon-eks --addon-name vpc-cni --addon-version  v1.12.6-eksbuild.1 \
    --service-account-role-arn arn:aws:iam::803035318642:role/AmazonEKSVPCCNIRole

{
    "addon": {
        "addonName": "vpc-cni",
        "clusterName": "axon-eks",
        "status": "CREATING",
        "addonVersion": "v1.12.6-eksbuild.1",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:803035318642:addon/axon-eks/vpc-cni/04c412fe-b266-36d8-d236-75b2fe42eab7",
        "createdAt": "2023-05-16T19:15:43.646000+00:00",
        "modifiedAt": "2023-05-16T19:15:43.733000+00:00",
        "serviceAccountRoleArn": "arn:aws:iam::803035318642:role/AmazonEKSVPCCNIRole",
        "tags": {}
    }
}
```

### Check the installation

Run

```shell
aws eks describe-addon --cluster-name axon-eks --addon-name vpc-cni --query addon.addonVersion --output text

v1.12.6-eksbuild.1
```

## Core DNS 

### Check Core DNS version

Run

```shell
aws eks describe-addon --cluster-name axon-eks --addon-name coredns --query addon.addonVersion --output text

An error occurred (ResourceNotFoundException) when calling the DescribeAddon operation: No addon: coredns found in cluster: axon-eks
```

### Save current CoreDNS configuration

To save the current CoreDNS configs , run 

```shell
kubectl get deployment coredns -n kube-system -o yaml > eks-universal/aws-k8s-coredns-old.yaml
```

### Create the add-on

To create the add-on , run

```shell
aws eks create-addon --cluster-name axon-eks --addon-name coredns --addon-version v1.9.3-eksbuild.3

{
    "addon": {
        "addonName": "coredns",
        "clusterName": "axon-eks",
        "status": "CREATING",
        "addonVersion": "v1.9.3-eksbuild.3",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:803035318642:addon/axon-eks/coredns/e0c41302-447e-0fc6-cf36-09f14b38fdc5",
        "createdAt": "2023-05-16T19:23:31.674000+00:00",
        "modifiedAt": "2023-05-16T19:23:31.695000+00:00",
        "tags": {}
    }
}
```

### Check the installation

To confirm that the installation was successful , run

```shell
aws eks describe-addon --cluster-name axon-eks --addon-name coredns --query addon.addonVersion --output text
```

## Installation

### Install AWS Load Balancer Controller

Installation is automatic and part of `/terraform/` directory.

### Verify the controller is installed

To verify that the controller is installed , run

```shell
kubectl get deployment -n kube-system aws-load-balancer-controller

NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           53s
```
