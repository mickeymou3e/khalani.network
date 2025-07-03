# Deployment
## Background : EIP-2353 Deployment process
Read [Diamond Deployments and Diamond Upgrades Section](https://eip2535diamonds.substack.com/p/introduction-to-the-diamond-standard)

Deploy the Diamond contract: Once the Diamond contract and its facets are implemented, the next step is to deploy the Diamond contract and then adding the facets using the DiamondCut interface.
The diamond cut interface allows developers to upgrade or modify specific functionalities of the Diamond contract without affecting other parts of the contract.


## Deployment Pipeline and Checklist
Lets go through the prerequisites to run the deployment script and how it works. It is important to see the order in which the contracts are deployed


```bash
# Configure environment variables
export AXON = axon
export REMOTES = eth, avax, polygon .......
export PRIVATE_KEY = <raw_private_key>
```

```json
//chain_name from the configured env variable above
  "<chain_name>" : {
    "chainId" : <>,
    "rpcUrl" : "<rpc_url>",
    "hyperlaneMailbox" : <hyperlane_mailbox_address>,
    "hyperlaneISM" : <hyperlane_ism_address>,
    "tokens" : [<token_address_1> , <token_address_2>]
  }
```
sample :
```bash
{
  "axon" : {
    "chainId" : 10012,
    "rpcUrl" : "https://www.axon-node.info/",
    "hyperlaneMailbox" : "0x025073B856D6f9b7D76d0268fa5394FF88F9c746",
    "hyperlaneISM" : "0xF36C2051cb441C777226647faF17174B84145220",
    "tokens" : []
  },
  "goerli" : {
    "chainId" : 5,
    "rpcUrl" : "<rpc_url>",
    "hyperlaneMailbox" : "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757",
    "hyperlaneISM" : "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757",
    "tokens" : ["0x18B98AB4fd6D9eAbDa5745885f263Ff24C9CA0D7","0xa8997cBA97c40a9242892722701E15652E5Ba408"]
    
  },
  "fuji" : {
    "chainId" : 43113,
    "rpcUrl" : "<rpc_url>",
    "hyperlaneMailbox" : "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757",
    "hyperlaneISM" : "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757",
    "tokens" : ["0x9462e15bDd59e3429E40dd0a9BCC9E844f102Aed","0x92567BaCb78f7daecB33030605B74e121bA5894e"]
  }
}
```

After setting up, command to run the deployment script
```
forge script script/DeployNexusMultiChain.sol --broadcast --private-key $PRIVATE_KEY
```
### Pipeline and Order
1. Deployment Configs are read from the json.
2. Nexus is deployed on axon and all the facets with the functions to be registered are added to this diamond
3. Kai is deployed on Axon chain
4. Vortex is deployed on axon chain and initialised
5. Nexus is deployed and initialised on all the remote chains one by one
6. Nexus of other chain is registered on axon chain
7. For each token address defined in the tokens array.. the corresponding mirror token is deployed and this pair is registered in the mapping, the reversed mapping is registered on corresponding nexus of the chain


 
