# Setup *local* environment Godwoken + Graph

## Start **Godwoken** ([godowken-kicker](https://github.com/RetricSu/godwoken-kicker))
1. Setup docker network  
In ```docker/docker-compose.yml``` add network.

```yaml
networks:
  default:
    name: godwoken
    
```
2. Start godwoken
 ```
    make init
    make start
```

Read [How to run](https://github.com/RetricSu/godwoken-kicker#how-to-run) section from Godwoken Readme for more info.
## Deploy local contracts ([stableswap-contracts](https://github.com/hadouken-project/stableswap-contracts))
## Run **Graph** node
## Deploy **Subgraph**
## Update config