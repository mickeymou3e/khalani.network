import os
import json
from itertools import cycle

from brownie.project.main import get_loaded_projects

from scripts.ethereum.accounts.utils import get_deployer_account
from scripts.ethereum.utils.tx import _tx_params

from scripts.ethereum.tokens.utils import get_all_tokens
from scripts.ethereum.pools.utils import (
  get_pools_path,
  get_pool_path,
  get_pool_data_config_path,
  get_pool_data_template_config_path,
  get_pool_data,
  get_swap_name,
  get_tokens_by_pool,
  get_all_pools_names,
)
from scripts.ethereum.registry.utils import get_registry_data
from scripts.ethereum.registry.add_pools import add_pool
from brownie import Registry


def _deploy_pool(pool_name, all_tokens, network, deployer):
  project = get_loaded_projects()[0]
  tx_params = _tx_params(deployer)
  owner = deployer

  pool_path = get_pool_path(pool_name)
  pool_data_path = get_pool_data_template_config_path(pool_name)
  pool_data = get_pool_data(pool_data_path)

  swap_name = get_swap_name(pool_path)
  swap_deployer = getattr(project, swap_name)
  token_deployer = getattr(project, pool_data.get("lp_contract"))

  # deploy the token
  token_args = pool_data["lp_constructor"]
  lp_token = token_deployer.deploy(token_args["name"], token_args["symbol"], tx_params)

  # find tokens
  tokens = get_tokens_by_pool(all_tokens, pool_data)

  # deploy the pool
  abi = next(i["inputs"] for i in swap_deployer.abi if i["type"] == "constructor")
  args = pool_data["swap_constructor"]
  args.update(
      _coins=tokens,
      _underlying_coins=tokens,
      _pool_token=lp_token,
      _owner=owner,
  )
  deployment_args = [args[i["name"]] for i in abi] + [tx_params]

  swap = swap_deployer.deploy(*deployment_args)

  # set the minter
  lp_token.set_minter(swap, tx_params)

  # deploy the zap
  # TODO: INVESTIGATE: how to operate on zap contract
  pools_path = get_pools_path()
  zap_name = next((i.stem for i in pools_path.glob(f"{pool_name}/Deposit*")), None)

  zap = None
  if zap_name is not None:
      zap_deployer = getattr(project, zap_name)

      abi = next(i["inputs"] for i in zap_deployer.abi if i["type"] == "constructor")
      args = {
          "_coins": tokens,
          "_underlying_coins": tokens,
          "_token": lp_token,
          "_curve": swap,
      }
      deployment_args = [args[i["name"]] for i in abi] + [tx_params]

      zap = zap_deployer.deploy(*deployment_args)


  return [swap, tokens, lp_token, zap]


def _overide_pooldata(pool_name, pool, network):
  [swap, tokens, lp_token, zap] = pool

  project = get_loaded_projects()[0]

  pool_data_template_config_path = get_pool_data_template_config_path(pool_name)

  pool_data = {}
  with pool_data_template_config_path.open("r") as fp:
    pool_data = json.load(fp)

  pool_data_config_path = get_pool_data_config_path(pool_name, network)

  with pool_data_config_path.open("w+") as fp:
    pool_data["swap_address"] = swap.address
    pool_data["lp_token_address"] = lp_token.address

    coins = pool_data["coins"]
    
    if zap:
      pool_data["zap_address"] = zap.address

    for coin in coins:
      coin_name = coin["name"]
      for token in tokens:
        if token.symbol() == coin_name:
          coin["underlying_address"] = token.address

    json.dump(pool_data, fp, indent=4, sort_keys=True)


def _update_registry(pool_name, network, deployer_account):
  pool_data_path = get_pool_data_config_path(pool_name, network)
  pool_data = get_pool_data(pool_data_path)

  registry_data = get_registry_data(network)
  registry_address = registry_data["registry_address"]

  registry = Registry.at(registry_address)

  add_pool(pool_data, registry, deployer_account, pool_name)

def _clear_registry(pool_name, network, deployer_account):
  tx_params = _tx_params(deployer_account)

  try:
    pool_data_path = get_pool_data_config_path(pool_name, network)
    pool_data = get_pool_data(pool_data_path)
  

    registry_data = get_registry_data(network)
    registry_address = registry_data["registry_address"]

    try:
      registry = Registry.at(registry_address)

      pool = pool_data["swap_address"]
      registry.remove_pool(pool, tx_params)
    except:
      print('Registry not deployed')
  except:
    print(f"No pooldata.json for {pool_name} pool")



def deploy(pool_name=None, network=None, deployer=None):
  pool_name = pool_name if pool_name else os.environ['DEPLOYMENT_POOL_NAME']
  network = network if network else os.environ['DEPLOYMENT_NETWORK']
  deployer = deployer if deployer else  get_deployer_account(network)

  tokens = get_all_tokens(network)

  pool = _deploy_pool(pool_name, tokens, network, deployer)

  _clear_registry(pool_name, network, deployer)

  _overide_pooldata(pool_name, pool, network)

  #TODO: fix registry updating
  # _update_registry(pool_name, network, deployer)


def deploy_all():
  network = os.environ['DEPLOYMENT_NETWORK']

  deployer_account = get_deployer_account(network)
  
  tokens = get_all_tokens(network)

  pools_names = get_all_pools_names()
  for pool_name in pools_names:
    pool = _deploy_pool(pool_name, tokens, network, deployer_account)

    _overide_pooldata(pool_name, pool, network)


