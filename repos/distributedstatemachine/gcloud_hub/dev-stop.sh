#!/bin/bash

echo "Stopping db";
docker stop db;
docker rm db;

echo "Stopping redis";
docker stop redis;
docker rm redis;

echo "Stopping rabbitmq";
docker stop rabbitmq;
docker rm rabbitmq;