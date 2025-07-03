# Deployment

## Deployment environments:
* Goerli
* Local

### 
## Deployment Tools
Deployment Scripts are written in `Python` so make sure you have Python3 installed. 
* Python Virtual Environments:
  ```
  # install
  pip install virtualenv
  
  # setup local folder with dependencies and executables 
  python3 -m venv env

  # activate environment
  source env/bin/activate
  ```
* [`brownie`](https://eth-brownie.readthedocs.io/en/stable/) used as deployment scripts execution environment.
* Ganache

## Deployment Scripts
All deployment scripts should be executed through target in `Makefile`. Deployment scripts are getting arguments as an environment variables, so declaration of all env variables should be done in `Makefile` target.
```
target:
	export ARG_1=$(arg_1); \
	export ARG_2=$(arg_2); \
	<script execution>;    \

```
Usage:
```
make arg_1=value_1 arg_2=value_2 target
```
### Testnet Deployment
Main deployment parameters are Infura ProjectID and network to deploy. \
List of possible testnet network's can be checked with: 
```
brownie networks list
```
Example:
```
make web3_infura_project_id=<INFURA_PROJECT_ID> network=goerli target
```

## Deployer Account
To be able to deploy, you need Ethereum account which contain balance to perform deploy to target network

Add account with id `hadouken_deployer` to brownie (https://eth-brownie.readthedocs.io/en/stable/account-management.html#importing-from-a-private-key):
```
brownie accounts new hadouken_deployer
```

After importing new account from a Private Key you can check it with:
```
brownie accounts list
```
## Deployment Metadata
### Pool
All pool's are defined in `contracts/pools/<pool_name>`. Directory `<pool_name>` is used to redeploy existent pool or deploy new one.\
\
Structure of **Pool** directory:
```
.
└── contracts
    └── pools
        └── <pool_name>
            ├── <contract_name>.vy
            ├── pooldata.json
            ├── pooldata.goerli.json
            ├── pooldata.<network>.json
            └── pooldata.dev.json

```
`pooldata.json` basic template describing pool contract and all constructor arguments.
 
 `pooldata.<network>.json` containing address of deployed contracts.

 ## Dev environment
 > Prerequesitions:
 > * Python
 > * brownie
 > * yarn
 > * ganache-cli

To have local network to interact with you need to follow next steps:
1. `yarn dev:network`
2. `yarn dev:run`
3. `yarn dev:deploy`