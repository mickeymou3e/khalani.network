# Solvers


## Create Secrets in Secret MAnager

```bash
aws secretsmanager create-secret --name "khalani/testnet/spoke-chain-caller-connection-urls" --secret-string '{
  "SEPOLIA_RPC_URL": "https://sepolia.infura.io/v3/",
  "SEPOLIA_WS_URL": "wss://sepolia.infura.io/v3/=",
  "FUJI_RPC_URL": "https://avalanche-fuji.infura.io/v3/",
  "FUJI_WS_URL": "wss://avalanche-fuji.infura.io/v3/"
}' --region "us-east-1"
```

output

```shell
{
    "ARN": "arn:aws:secretsmanager:us-east-1:803035318642:secret:khalani/testnet/spoke-chain-caller-connection-urls-mHTM2L",
    "Name": "khalani/testnet/spoke-chain-caller-connection-urls",
    "VersionId": "8ef1e892-4175-487e-87d0-ce0542e59d4a"
}
```
