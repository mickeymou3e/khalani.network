# Add scripts to module path resolving
import sys

scripts_path = 'scripts'

if scripts_path not in sys.path:
    sys.path.append(scripts_path)
#!

import os
from itertools import cycle

from scripts.ethereum.utils.tx import (_tx_params)
from scripts.ethereum.accounts.utils import get_deployer_account
from scripts.ethereum.pools.utils import (
  get_token_wei,
  get_pool_contracts,
  get_all_pools_names
)
from scripts.ethereum.tokens.utils import get_all_tokens


INIT_LIQUIDITY_AMOUNT = 10 ** 2

def _init(pool, admin):
  [swap, tokens, _] = pool

  mint_values = list(map(lambda token:
    get_token_wei(lambda mul: INIT_LIQUIDITY_AMOUNT * mul, token),
    tokens
  ))

  for token, mint_value in zip(tokens, mint_values):
    print("token", token)
    print("token", mint_value)
    # token._mint_for_testing(mint_value, _tx_params(admin))
    token.approve(swap.address, mint_value, _tx_params(admin))

  swap.add_liquidity(mint_values, 0, _tx_params(admin))


def init():
  pool_name = os.environ['DEPLOYMENT_POOL_NAME']
  network = os.environ['DEPLOYMENT_NETWORK']
  deployer_account = get_deployer_account(network)

  pool = get_pool_contracts(pool_name, network)

  _init(pool, deployer_account)


def init_all():
  network = os.environ['DEPLOYMENT_NETWORK']

  deployer_account = get_deployer_account(network)
  
  tokens = get_all_tokens(network)

  pools_names = get_all_pools_names()
  for pool_name in pools_names:
    if(pool_name == '3pool'):
      print(pool_name)
      pool = get_pool_contracts(pool_name, network)

      _init(pool, deployer_account)

