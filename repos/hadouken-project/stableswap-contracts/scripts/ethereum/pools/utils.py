import json

from brownie.project.main import get_loaded_projects

from scripts.ethereum.tokens.utils import get_token


def get_token_wei(valueGenerator, token):
  return valueGenerator(10 ** token.decimals())

def get_token_amount_range(token, _range):
  [_min, _max] = get_token_wei(
    lambda mul: list(map(lambda range_value: range_value * mul, _range)),
    token
  )
  return [_min, _max]

def get_tokens_by_pool(tokens, pool_data):
    result_tokens = []

    tokens_data = pool_data['coins']
    tokens_symbols = list(map(lambda td: td['name'] ,tokens_data))
    result_tokens = list(filter(lambda token: token.symbol() in tokens_symbols, tokens))

    if len(result_tokens) != len(tokens_data):
      raise 'Not all required tokens are deployed'

    return result_tokens

def get_pools_path():
  project = get_loaded_projects()[0]
  pools_path = project._path.joinpath("contracts/pools")

  return pools_path


def get_pool_path(pool_name):
  project = get_loaded_projects()[0]
  pool_path = project._path.joinpath(f"contracts/pools/{pool_name}")
  if not pool_path.exists():
    raise Exception("Pool %s do not defined" % (pool_name))

  return pool_path


def get_pool_data_config_path(pool_name, network):
  pool_path = get_pool_path(pool_name)
  pool_data_config_path = pool_path.joinpath(f"pooldata.{network}.json")

  return pool_data_config_path


def get_pool_data_template_config_path(pool_name):
  pool_path = get_pool_path(pool_name)
  pool_data_config_path = pool_path.joinpath(f"pooldata.json")

  return pool_data_config_path


def get_all_pools_names():
  pools_path = get_pools_path()

  pools_names = []
  for pool_path in pools_path.glob('*'):
    pool_name = pool_path.stem
    pools_names.append(pool_name)

  return pools_names


def get_pool_data(pool_data_path):
  pool_data = {}
  
  with pool_data_path.open() as fp:
    pool_data = json.load(fp)
  
  return pool_data

def get_all_pool_data(network):
  all_pool_data = {}

  pools_names = get_all_pools_names()
  for pool_name in pools_names:
    pool_data_config_path = get_pool_data_config_path(pool_name, network)
    pool_data = get_pool_data(pool_data_config_path)
    all_pool_data[pool_name] = pool_data

  return all_pool_data


def get_pool_tokens(pool_data):
  project = get_loaded_projects()[0]

  tokens_addresses = map(lambda coin: coin['underlying_address'], pool_data["coins"])
  tokens = list(map(lambda token_address: get_token(token_address), tokens_addresses))

  return tokens


def get_pool_lp_token(pool_data):
  project = get_loaded_projects()[0]

  lp_contract = pool_data["lp_contract"]

  token_contract_container = getattr(project, lp_contract)

  lp_token_address = pool_data["lp_token_address"]
  lp_token_contract= token_contract_container.at(lp_token_address)

  return lp_token_contract 


def get_swap_contact_container(swap_name):
  project = get_loaded_projects()[0]

  swap_contract_container = getattr(project, swap_name)

  return swap_contract_container

def get_swap_name(pool_path):
  swap_name = next(i.stem for i in pool_path.glob(f"StableSwap*"))\
  
  return swap_name


def get_swap_contract(pool_data, pool_path):
  swap_name = get_swap_name(pool_path)
  swap_contract_container = get_swap_contact_container(swap_name)

  swap_address = pool_data["swap_address"]
  swap_contract = swap_contract_container.at(swap_address)

  return swap_contract


def get_pool_contracts(pool_name, network):
  pool_path = get_pool_path(pool_name)
  pool_data_path = get_pool_data_config_path(pool_name, network)
  pool_data = get_pool_data(pool_data_path)

  tokens_contracts = get_pool_tokens(pool_data)
  lp_token_contract = get_pool_lp_token(pool_data)
  swap_contract = get_swap_contract(pool_data, pool_path)

  return [swap_contract, tokens_contracts, lp_token_contract]
