deploy:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/pools/deploy.py deploy_all --network $(network);\
	brownie run scripts/ethereum/pools/init.py init_all --network $(network);\
	brownie run scripts/ethereum/registry/deploy.py --network $(network);  

deploy-with-tokens:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/tokens/deploy.py deploy_all --network $(network);\
	brownie run scripts/ethereum/pools/deploy.py deploy_all --network $(network);\
	brownie run scripts/ethereum/pools/init.py init_all --network $(network);\
	brownie run scripts/ethereum/registry/deploy.py --network $(network);  

deploy-pool:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_POOL_NAME=$(pool); \
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/pools/deploy.py deploy --network $(network);


deploy-all-pools:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_POOL_NAME=$(pool); \
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/pools/deploy.py deploy_all --network $(network);


deploy-token:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_TOKEN_NAME=$(token); \
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/tokens/deploy.py deploy --network $(network);


deploy-all-tokens:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/tokens/deploy.py deploy_all --network $(network);


init-pool:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_POOL_NAME=$(pool); \
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/pools/init.py init --network $(network);


init-all-pools:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	export DEPLOYMENT_NETWORK=$(network); \
	brownie run scripts/ethereum/pools/init.py init_all --network $(network);


sim-pool:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id); \
	export DEPLOYMENT_POOL_NAME=$(pool); \
	export DEPLOYMENT_NETWORK=$(network); \
	export SIMULATION_ITERS=$(iters); \
	brownie run scripts/ethereum/pools/simulation.py all --network $(network);


sim-all-pools:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id); \
	export DEPLOYMENT_NETWORK=$(network); \
	export SIMULATION_ITERS=$(iters); \
	brownie run scripts/ethereum/pools/simulation.py sim_all_pools --network $(network);


sim-pool-swap:
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id); \
	export DEPLOYMENT_POOL_NAME=$(pool); \
	export DEPLOYMENT_NETWORK=$(network); \
	export SIMULATION_ITERS=$(iters); \	
	brownie run scripts/ethereum/pools/simulation.py swap --network $(network);


deploy-registry:
	export DEPLOYMENT_NETWORK=$(network); \
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	brownie run scripts/ethereum/registry/deploy.py --network $(network);  

deploy-metapool-factory:
	export DEPLOYMENT_NETWORK=$(network); \
	export WEB3_INFURA_PROJECT_ID=$(web3_infura_project_id);\
	brownie run scripts/ethereum/metapoolfactory/deploy --network $(network);
