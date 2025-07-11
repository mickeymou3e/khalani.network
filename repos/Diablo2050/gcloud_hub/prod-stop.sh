#!/bin/bash

echo "Stopping db";
docker stop db-prod;
docker rm db-prod;

echo "Stopping redis";
docker stop redis-prod;
docker rm redis-prod;

echo "Stopping celery";
docker stop celery-prod;
docker rm celery-prod;

echo "Stopping server";
docker stop server-prod;
docker rm server-prod;

echo "Stopping nginx";
docker stop nginx-prod;
docker rm nginx-prod;
