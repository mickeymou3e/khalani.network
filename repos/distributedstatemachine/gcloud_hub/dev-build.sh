#!/bin/bash

docker build -t db ./db;
docker build -t redis ./redis;
docker build -t rabbitmq ./rabbitmq;