import os
import json

from brownie import ERC20

from scripts.ethereum.tokens.utils import get_token_data, overide_token_config, get_tokens_data_template
from scripts.ethereum.accounts.utils import get_deployer_account
from scripts.ethereum.utils.tx import _tx_params


def _deploy_token(token_name, token_data, network, deployer):
  token_name = token_data["name"]
  token_decimals = token_data["decimals"]

  tx_params = _tx_params(deployer)

  token = ERC20.deploy(token_name, token_name, token_decimals, tx_params)

  return token


def deploy():
  token_name = os.environ['DEPLOYMENT_TOKEN_NAME']
  network = os.environ['DEPLOYMENT_NETWORK']

  deployer_account = get_deployer_account(network)

  token_data = get_token_data(token_name, network)
  token = _deploy_token(token_name, token_data, network, deployer_account)
  
  overide_token_config(token, network)

  return token


def deploy_all():
  network = os.environ['DEPLOYMENT_NETWORK']

  deployer_account = get_deployer_account(network)

  tokens_data = get_tokens_data_template()

  deployed_tokens = []
  for token_data in tokens_data:
    token_name = token_data["name"]
    deployed_token = _deploy_token(token_name, token_data, network, deployer_account)
    deployed_tokens.append(deployed_token)
  
    overide_token_config(deployed_token, network)

  return deployed_tokens