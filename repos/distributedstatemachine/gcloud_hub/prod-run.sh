#!/bin/bash

# get env variables
source .env

# create network
NETWORK_NAME="ezkl_hub_network"

# Check if the network already exists
if ! docker network inspect $NETWORK_NAME &>/dev/null; then
    # Create the network
    docker network create $NETWORK_NAME
    echo "Network '$NETWORK_NAME' created successfully."
else
    echo "Network '$NETWORK_NAME' already exists. Skipping network creation."
fi

# run images

echo "Running db-prod...";
docker run -d --name db-prod \
    -p 0.0.0.0:5432:5432 \
    --network $NETWORK_NAME \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    --restart always \
    db;

echo "Running redis-prod...";
docker run -d --name redis-prod \
    -p 0.0.0.0:6379:6379 \
    --network $NETWORK_NAME \
    -e REDIS_PASSWORD=$REDIS_PASSWORD \
    --restart always \
    redis;
sleep 5;

echo "Running celery-prod...";
docker run -d --name celery-prod \
    --network $NETWORK_NAME \
    --restart always \
    -e CELERY_BROKER_URL=$CELERY_BROKER_URL \
    -e CELERY_RESULT_BACKEND=$CELERY_RESULT_BACKEND \
    -e SQLALCHEMY_DATABASE_URI=$SQLALCHEMY_DATABASE_URI \
    -e SECRET_KEY=$SECRET_KEY \
    -e FERNET_SECRET=$FERNET_SECRET \
    -e GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    -e GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET \
    server run celery --app app.celery worker --loglevel info;
sleep 5;

echo "Running server-prod...";
docker run -d --name server-prod \
    -p 0.0.0.0:5001:5000 \
    --network $NETWORK_NAME \
    --restart always \
    -e CELERY_BROKER_URL=$CELERY_BROKER_URL \
    -e CELERY_RESULT_BACKEND=$CELERY_RESULT_BACKEND \
    -e SQLALCHEMY_DATABASE_URI=$SQLALCHEMY_DATABASE_URI \
    -e SECRET_KEY=$SECRET_KEY \
    -e FERNET_SECRET=$FERNET_SECRET \
    -e GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    -e GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET \
    server run gunicorn app:app -w 3 -b 0.0.0.0:5000 --timeout 120;
sleep 5;

echo "Running nginx-prod...";
docker run -d --name nginx-prod \
    -v ./nginx/certificates:/etc/ssl \
    -p 0.0.0.0:80:80 -p 0.0.0.0:443:443 \
    --network $NETWORK_NAME \
    --restart always \
    nginx;
