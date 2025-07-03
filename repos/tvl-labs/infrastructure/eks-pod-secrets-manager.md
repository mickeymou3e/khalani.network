# AWS Secrets Manager in Kubernetes cluster

## AWS IAM authentication for pod

Make sure you have IODC AWS IAM authentication for pods in the cluster installed. It is by default installed on AWS EKS, but for local cluster you have to follow: https://github.com/tvl-labs/infrastructure/wiki/AWS-authentication-in-Kubernetes

## CSI driver installation

Installation of the CSI driver and AWS provider:

```
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver --namespace kube-system --set syncSecret.enabled=true --set enableSecretRotation=true --set rotationPollInterval=5m
kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml
```

## Create secret in AWS

Create secret in AWS.

Make sure Resource permissions of the secret allow pod IAM role to get the secret. Example policy:
```
{
  "Version" : "2012-10-17",
  "Statement" : [ {
    "Effect" : "Allow",
    "Principal" : {
      "AWS" : "arn:aws:iam::803035318642:role/hyperlane-relayers-khalani"
    },
    "Action" : [ "secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret" ],
    "Resource" : "arn:aws:secretsmanager:us-east-1:803035318642:secret:khalani/testnet/hyperlane-connection-urls-6dSDWB"
  } ]
}
```

## Connecting secret to Kubernetes

Specify secret name in `secretproviderclass.yaml` under `spec.parameters.objects.objectName`. For example:
```
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: blockchain-rpcs-aws-secret-class
spec:
  provider: aws
  parameters:
    region: us-east-1
    objects: |
      - objectName: "khalani/testnet/hyperlane-connection-urls"
        objectType: "secretsmanager"
        jmesPath:
          - path: "HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS"
            objectAlias: "khalaniConnectionUrl"
          - path: "HYP_CHAINS_GOERLI_CUSTOMRPCURLS"
            objectAlias: "goerliConnectionUrl"
          - path: "HYP_CHAINS_FUJI_CUSTOMRPCURLS"
            objectAlias: "fujiConnectionUrl"
  secretObjects:
    - data:
      - key: HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS
        objectName: khalaniConnectionUrl
      - key: HYP_CHAINS_GOERLI_CUSTOMRPCURLS
        objectName: goerliConnectionUrl
      - key: HYP_CHAINS_FUJI_CUSTOMRPCURLS
        objectName: fujiConnectionUrl
      secretName: hyperlane-connection-urls
      type: Opaque   
```

1. `jmesPath.path` is key value from JSON stored in Secrets Manager.
2. `secretObjects.secretName` is name of the Kubernetes secret that will be created.

## Local cluster

### Example template

Here is a complete template you can play with for AWS Secrets Manager on local cluster to test the setup:
```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-sa
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::803035318642:role/pod-example-role
---
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: hyperlane-connection-urls-aws-secret
spec:
  provider: aws
  parameters:
    region: us-east-1
    objects: |
      - objectName: "MySecret"
        objectType: "secretsmanager"
        jmesPath:
          - path: "HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS"
            objectAlias: "khalaniConnectionUrl"
          - path: "HYP_CHAINS_GOERLI_CUSTOMRPCURLS"
            objectAlias: "goerliConnectionUrl"
          - path: "HYP_CHAINS_FUJI_CUSTOMRPCURLS"
            objectAlias: "fujiConnectionUrl"
  secretObjects:
    - data:
      - key: HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS
        objectName: khalaniConnectionUrl
      - key: HYP_CHAINS_GOERLI_CUSTOMRPCURLS
        objectName: goerliConnectionUrl
      - key: HYP_CHAINS_FUJI_CUSTOMRPCURLS
        objectName: fujiConnectionUrl
      secretName: hyperlane-connection-urls
      type: Opaque   
---
apiVersion: v1
kind: Pod
metadata:
  name: test
spec:
  serviceAccountName: my-sa
  restartPolicy: Never
  containers:
    - name: my-aws-cli
      image: alpine:latest
      command: [ "/bin/sh", "-c", "--" ]
      args: ["echo $(HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS);echo $(HYP_CHAINS_GOERLI_CUSTOMRPCURLS);echo $(HYP_CHAINS_FUJI_CUSTOMRPCURLS);"]
      env:
        - name: AWS_REGION
          value: us-east-1
        - name: HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS
          valueFrom:
            secretKeyRef:
              name: hyperlane-connection-urls
              key: HYP_CHAINS_KHALANITESTNET_TRIAL_CUSTOMRPCURLS
        - name: HYP_CHAINS_GOERLI_CUSTOMRPCURLS
          valueFrom:
            secretKeyRef:
              name: hyperlane-connection-urls
              key: HYP_CHAINS_GOERLI_CUSTOMRPCURLS
        - name: HYP_CHAINS_FUJI_CUSTOMRPCURLS
          valueFrom:
            secretKeyRef:
              name: hyperlane-connection-urls
              key: HYP_CHAINS_FUJI_CUSTOMRPCURLS
      volumeMounts:
        - name: secrets-store-inline # The volume mount is required for the Sync With Kubernetes Secrets
          mountPath: "/mnt/secrets-store"
          readOnly: true
      resources:
        limits:
          cpu: "500m"
          memory: "512Mi"
      
  volumes:
    - name: secrets-store-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "hyperlane-connection-urls-aws-secret"
```

### Deploy Hyperlane relayer

Before you can proceed with deployment of Hyperlane relayer to minikube cluster make sure to change the signer keys to some dummy keys that you have access on your local Kubernetes cluster. Your local Kubernetes cluster won't be able to have pod authentication like it is done on on AWS EKS, because you have different OIDC provider locally. You have to change AWS IAM role trust policy to be able to access that role from pods deployed to your local minikube cluster.

Khalani relayer deployment example:

```
kubectl create ns hyperlane
kubectl create ns monitoring
```

Monitoring: [installation instruction.](./monitoring/prometheus-stack/README.md)

Hyperlane:
```
kubectl config set-context --current --namespace=hyperlane
cd hyperlane
make create-config
make deploy-secrets
make deploy-relayer-khala
```

Delete:
```
make uninstall-relayer-khalani
make uninstall-relayers-secrets
make delete-config
```

Logs:
```
kubectl logs -l app.kubernetes.io/name=hyperlane-relayers-khalani
```

### Get KMS address on local cluster

Login to minikube container via: https://stackoverflow.com/a/68878574/2166409

```
curl localhost:9090/metrics
```

Look for: `wallet_address=` - it will be signer KMS EVM address.

## Literature

1. https://secrets-store-csi-driver.sigs.k8s.io/
2. https://github.com/aws/secrets-store-csi-driver-provider-aws