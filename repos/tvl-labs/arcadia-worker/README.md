//
// # Deposit Intent Worker Service
A Node.js microservice that watches for token mint events, records deposit intents in DynamoDB, and publishes intents via the Arcadia SDK in a fire‑and‑forget background flow.

⸻

## 🏗️ Project Structure

```
src/
├── app.ts # Entry point: mount routes & error handler
├── config.ts # Env vars, DynamoDB & Arcadia SDK setup
├── utils/
│ └── errors.ts # AppError class & Express error middleware
├── services/
│ ├── depositService.ts # DynamoDB persistence (create, list, update)
│ └── processor.ts # Background job: waitForMint + proposeIntent
├── routes/
│ ├── monitorMinting.ts # POST /api/monitorMinting (fire‑and‑forget)
│ └── deposits.ts # GET /api/deposits[?status], GET /api/deposits/:id
└── types/ # (optional) shared TypeScript interfaces
```

⸻

## ⚙️ Prerequisites

• Node.js v16+  
• npm or yarn  
• AWS account with:  
• DynamoDB table named by DYNAMODB_TABLE (default: DepositIntents)  
• IAM Task Role with DynamoDB read/write permissions

⸻

## 🚀 Installation & Build

### Install dependencies

```
npm install
```

### Type‑check & compile

```
npm run build
```

• Entry point after build: dist/app.js

⸻

## 🏃 Running Locally

### Compile and start

```
npm run build
node dist/app.js
```

Service listens on http://localhost:<PORT> (default 3000).

### Local development with Docker

1. **Start DynamoDB Local**

```bash
docker run -d --name dynamo-local -p 8000:8000 amazon/dynamodb-local
```

2. **Create the table if it doesn’t exist**

```bash
aws dynamodb create-table \
  --table-name DepositIntents \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userAddress,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[{"IndexName":"ByUserIndex","KeySchema":[{"AttributeName":"userAddress","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --endpoint-url http://localhost:8000 \
  --region us-west-2
```

3. **Build the Docker image**

```bash
docker build --no-cache -t deposit-worker .
```

4. **Run the worker in the foreground (see logs live)**

First, load environment variables from `.env`:

```bash
export $(grep -v '^#' .env | xargs)
```

Then start the container:

```bash
docker run --rm --name deposit-worker \
  -p 3000:3000 \
  -e PORT=$PORT \
  -e AWS_REGION=$AWS_REGION \
  -e DYNAMODB_TABLE=$DYNAMODB_TABLE \
  -e DYNAMODB_ENDPOINT=$DYNAMODB_ENDPOINT \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  deposit-worker
```

⸻

## 📦 Docker

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

```
docker build -t deposit-worker .
docker run -e AWS_REGION=eu-west-2 \
 -e DYNAMODB_TABLE=DepositIntents \
 -p 3000:3000 deposit-worker
```

⸻

## ☁️ AWS Deployment (ECS Fargate)

1. Create DynamoDB table  
   • PK: id (String)  
   • GSI: ByUserIndex on userAddress (String) + optional createdAt (String)

2. IAM Task Role  
   Attach inline policy allowing:

   ```json
   {
     "Effect": "Allow",
     "Action": [
       "dynamodb:PutItem",
       "dynamodb:UpdateItem",
       "dynamodb:GetItem",
       "dynamodb:Query",
       "dynamodb:DeleteItem",
       "dynamodb:DescribeTable"
     ],
     "Resource": [
       "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT}:table/${DYNAMODB_TABLE}",
       "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT}:table/${DYNAMODB_TABLE}/index/ByUserIndex"
     ]
   }
   ```

   3. ECS Task Definition  
      • Container image: deposit-worker:latest  
      • Environment vars: PORT, AWS_REGION, DYNAMODB_TABLE  
      • Health check: GET /healthz

   4. ECS Service  
      • Desired count ≥ 1  
      • Auto‑restart on failure (default ECS behavior)

## 🚀 ECR Deployment Instructions

1. Set environment variables:

   ```bash
    PORT=3000
    AWS_REGION=us-west-2
    DYNAMODB_TABLE=DepositIntents

    AWS_ACCOUNT_ID=<ACCOUNT_ID>
    ECR_REPOSITORY=arcadia-worker-service
    CLUSTER_NAME=arcadia-worker
    SERVICE_NAME=arcadia-worker-service
    TASK_FAMILY=arcadia-worker

    NODE_ENV=development
   ```

2. Export image URI:

   ```bash
   export IMAGE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:latest"
   ```

3. Login to ECR:

   ```bash
   aws ecr get-login-password \
     --region $AWS_REGION \
   | docker login \
     --username AWS \
     --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
   ```

4. Build image:

   ```bash
   docker build --platform linux/arm64 -t "$IMAGE_URI" .
   ```

5. Push image:

   ```bash
   docker push "$IMAGE_URI"
   ```

6. Define ECS task:

   ```bash
   NEW_TASK_DEF_ARN=$(
     aws ecs register-task-definition \
       --region        $AWS_REGION \
       --cli-input-json file://ecs-task-def.json \
       --query         'taskDefinition.taskDefinitionArn' \
       --output        text
   )
   echo "✔ Registered: $NEW_TASK_DEF_ARN"
   ```

7. Update ECS service:
   ```bash
   aws ecs update-service \
     --region          $AWS_REGION \
     --cluster         $CLUSTER_NAME \
     --service         $SERVICE_NAME \
     --task-definition $NEW_TASK_DEF_ARN \
     --force-new-deployment
   echo "🚀 Deployed revision on $CLUSTER_NAME/$SERVICE_NAME"
   ```

##

⸻

## 🔗 API Endpoints

• POST /api/monitorMinting  
Fire‑and‑forget a deposit + intent:

```json
{
  "userAddress": "0x…",
  "expectedBalance": "1000000000000000000",
  "tokenAddress": "0x…",
  "chainId": 1,
  "intent": {
    /* MedusaIntent */
  },
  "intentSignature": { "r": "…", "s": "…", "v": "…" }
}
```

Response: 202 Accepted → { depositId: string }

• GET /api/deposits?userAddress=<>&status=<pending|error|success>  
List a user’s deposits, optionally filtered by status.

• GET /api/deposits/:id  
Fetch a single deposit record by its ID.

• GET /healthz  
Health check (returns 200 OK).

⸻

## 📋 Status & Errors

• status: pending | success | error  
• errorMessage contains failure detail (ExecTimeout, DepositRevert, etc.).  
• All errors return JSON:

```json
{
  "code": "ERR_INVALID_PARAMS",
  "message": "Missing required fields"
}
```

⸻

## 🛡️ Notes

• Fire‑and‑forget lets your API respond immediately; the background worker updates status in DynamoDB.  
• UI should poll GET /api/deposits or subscribe via WebSocket for real‑time updates.

⸻
//

```

```
