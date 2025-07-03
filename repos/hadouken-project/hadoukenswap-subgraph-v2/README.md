# Subgraph for Hadouken Contracts V2 (Balancer V2)

#### Local Subgraph (default: testnet read-only)
##### Set Docker Graph node
```
cd ./docker
docker-compose up
```

Graph node is deployed on AWS.  
-------------------------------------------------
> #### Restart AWS Service  
> In case error happened on graph-node, tha blocking interaction with it or some parameters need to be changed node need to be restarted.
> * update Service with `Number of tasks` set to 0
> * ssh into RDS instance `psql -h hostname -p portNumber -U userName dbName -W`
> * log in to DB with password from AWS Task Definition
> * list all DB's `\l`, select other that graphnode (like postgres)
> * connect to other DB with `\c {db-name}`
> * drop graph-node base `DROP DATABASE {db-name};`
> * create graph-node base `CREATE DATABASE {db-name};`
> * update Service with `Number of tasks` set to 1