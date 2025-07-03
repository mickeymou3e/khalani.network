# Admin Dashboard Deployment

## Deployment Steps

### 1. Configure AWS Stack using Deployment Repository

To set up the AWS infrastructure for the Admin Dashboard application, add the following configuration parameters for the chain:

```json
{
  "Parameters": {
    "CertificateArn": "",
    "DomainName": "admin-dashboard-chain.hadouken.finance",
    "HostedZoneId": "",
    "Password": ""
  }
}
```

### 2. Configure CI Deploy in `.github/workflows`

To automate the deployment process for the chain, create a new `.yml` file specifically for the chain deployment within your project's `.github/workflows` directory.

### 3. Add AWS Secrets

- Navigate to IAM to find the deployer role for the chain and create a deploy access key.

- In your repository, go to the "Settings" tab and click on "Secrets and variables" to access the repository's secrets management.

- Add the following secrets:

  - `CHAIN_ACCESS_KEY`: AWS deployer key.
  - `CHAIN_ACCESS_KEY_ID`: AWS deployer key ID.
  - `CHAIN_DISTRIBUTION_ID`: The distribution ID from CloudFront.

### 4. Trigger CI Deploy from GitHub

Run workflow manually from Github
