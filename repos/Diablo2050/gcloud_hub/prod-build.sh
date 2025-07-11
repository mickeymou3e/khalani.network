#!/bin/bash

# get environment
source .env

# TODO: use docker secrets or kubenetes secrets later
# An issue with this setup is that the someone will be able to hijack the secrets
# once the server is compromised. But there's nothing much that can be done if that
# happens anyway. Encrypting secrets don't exactly help either because they will need
# to be decrypted at runtime to run stuff.

# docker build -t db --build-arg password=$POSTGRES_PASSWORD ./db;
# docker build -t redis --build-arg password=$REDIS_PASSWORD ./redis;
# docker build -t nginx --no-cache ./nginx;
# docker build -t server \
#     --build-arg celeryBrokerUrl=$CELERY_BROKER_URL \
#     --build-arg celeryResultBackend=$CELERY_RESULT_BACKEND \
#     --build-arg sqlalchemyDatabaseUri=$SQLALCHEMY_DATABASE_URI \
#     --build-arg secretKey=$SECRET_KEY \
#     --no-cache \
#     ./server;

docker build -t db ./db;
docker build -t redis ./redis;
docker build -t nginx --no-cache ./nginx;
docker build -t server ./server;