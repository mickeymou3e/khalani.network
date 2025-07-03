# Security Guide for E2E Testing

## Overview

This SDK uses AWS Secrets Manager for secure private key management during E2E testing. This approach eliminates the need for hardcoded private keys in environment variables or configuration files.

## Setup Instructions

### 1. AWS Configuration

Set up your AWS credentials:

```bash
export AWS_REGION=us-west-2
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_SECRET_NAME=testnet/mainnet
```

### 2. IAM Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:CreateSecret",
        "secretsmanager:PutSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:khalani-sdk/e2e-test-keys/*"
    }
  ]
}
```

### 3. Running E2E Tests

```bash
npm run simulation
```

The first run will:

1. Generate a new test wallet
2. Store the private key securely in AWS Secrets Manager
3. Display the wallet address for funding
4. Run the E2E tests

Subsequent runs will:

1. Retrieve the existing private key from AWS Secrets Manager
2. Run the E2E tests
