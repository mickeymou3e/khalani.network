#!/bin/bash

docker run -d --name db -v ./db/postgres-data:/var/lib/postgresql/data -p 5432:5432 --restart always db;
docker run -d --name redis -e REDIS_PASSWORD=redis -p 6379:6379 --restart always redis;
docker run -d --name rabbitmq -e RABBITMQ_DEFAULT_USER=test -e RABBITMQ_DEFAULT_PASS=test -p 5672:5672 -p 15672:15672 rabbitmq;