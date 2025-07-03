import json

from brownie.project.main import get_loaded_projects

def get_tokens_data_config_path(network):
  project = get_loaded_projects()[0]
  tokens_path = project._path.joinpath("contracts/tokens")

  return tokens_path.joinpath(f"tokensdata.{network}.json")

def get_tokens_data_template_config_path():
  project = get_loaded_projects()[0]
  tokens_path = project._path.joinpath("contracts/tokens")

  return tokens_path.joinpath(f"tokensdata.json")

def get_data(path):
  tokens_data = None

  with path.open("r") as fp:
      tokens_data = json.load(fp)
  
  return tokens_data

def get_tokens_data(network):
  tokens_data_path = get_tokens_data_config_path(network)
  return get_data(tokens_data_path)


def get_tokens_data_template():
  tokens_data_path = get_tokens_data_template_config_path()
  return get_data(tokens_data_path)

def get_token_data(token_name, network):
  tokens_data = get_tokens_data(network)

  filtered_tokens_data = list(filter(lambda token_data: token_data["name"] == token_name, tokens_data))
  
  if not len(filtered_tokens_data) > 0:
    raise LookupError(f'No {token_name} token data')

  token_data = filtered_tokens_data[0]
  return token_data

def get_token(token_address):
  project = get_loaded_projects()[0]
  
  token_contract_container = getattr(project, 'ERC20')

  tokens_contract = token_contract_container.at(token_address)

  return tokens_contract

def overide_token_config(token, network):
  project = get_loaded_projects()[0]

  tokens_path = project._path.joinpath(f"contracts/tokens")
  tokens_data = []

  tokens_config_path = tokens_path.joinpath(f"tokensdata.{network}.json")

  if tokens_config_path.exists():
    with tokens_config_path.open("r+") as fp:
      tokens_data = json.load(fp)

  with tokens_config_path.open("w+") as fp:
    coins = tokens_data

    for coin in coins:
      coin_name = coin['name']
      if token.symbol() == coin_name:
        coin['underlying_address'] = token.address
        coin['name'] = token.name()
        coin['decimals'] = token.decimals()
        break
    else:
      new_coin = {}
      new_coin['underlying_address'] = token.address
      new_coin['name'] = token.name()
      new_coin['decimals'] = token.decimals()

      coins.append(new_coin)

    tokens_data = coins
    json.dump(tokens_data, fp, indent=4, sort_keys=True)


def get_all_tokens(network):
  project = get_loaded_projects()[0]

  tokens_path = project._path.joinpath(f"contracts/tokens")
  tokens_data = []

  token_contract_container = getattr(project, 'ERC20')

  tokens_config_path = tokens_path.joinpath(f"tokensdata.{network}.json")
  
  with tokens_config_path.open("r") as fp:
    tokens_data = json.load(fp)

    tokens_addresses = map(lambda coin: coin['underlying_address'], tokens_data)
    tokens_contracts = list(map(lambda token_address: token_contract_container.at(token_address), tokens_addresses))

  return tokens_contracts

