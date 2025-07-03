import os
from random import (sample, randrange)
from itertools import cycle

from scripts.ethereum.accounts.utils import get_test_accounts

from scripts.ethereum.utils.tx import (_tx_params)
from scripts.ethereum.pools.utils import get_pool_contracts, get_token_amount_range, get_all_pools_names

DEPOSIT_AMOUNT_RANGE = [10 ** 2, 10 ** 5]

EXCHANGE_AMOUNT_RANGE = [10, 10 ** 4]

def rotate(l, n):
  return l[n:] + l[:n]
  
def generate_account_groups(accounts, groups_num):
  avg = len(accounts) / float(groups_num)
  out = []
  last = 0

  while last < len(accounts):
      out.append(accounts[int(last):int(last + avg)])
      last += avg

  return out


def get_token_deposit_range(token):
  [min_deposit, max_deposit] = get_token_amount_range(token, DEPOSIT_AMOUNT_RANGE)

  return [min_deposit, max_deposit]

def get_token_exchange_range(token):
  [min_exchange, max_exchange] = get_token_amount_range(token, EXCHANGE_AMOUNT_RANGE)

  return [min_exchange, max_exchange]

def get_activity_token_amount(token, range_fn):
  [min_deposit, max_deposit] = range_fn(token)

  return randrange(min_deposit, max_deposit)

def get_deposit_token_amount(token):
  return get_activity_token_amount(token, get_token_deposit_range)

def get_exchange_token_amount(token):
  return get_activity_token_amount(token, get_token_exchange_range)

def generate_deposit_activity(pool, accounts):
  [swap, tokens, _] = pool
  print(tokens)
  for acc in accounts:
    for token in tokens:
      [_, max_deposit] = get_token_deposit_range(token)

      token._mint_for_testing(max_deposit, _tx_params(acc))
      token.approve(swap.address, max_deposit, _tx_params(acc))

  for acc in accounts:
    token_amounts = list(map(lambda token: get_deposit_token_amount(token), tokens))
    swap.add_liquidity(token_amounts, 0, _tx_params(acc))

  return accounts

def generate_exchange_activity(pool, accounts, tx_limit):
  [swap, tokens, _] = pool

  for acc in accounts:
    for token in tokens:
      [_, max_exchange] = get_token_exchange_range(token)
      mint_amount = tx_limit * max_exchange
      token._mint_for_testing(mint_amount, _tx_params(acc))
      token.approve(swap.address, mint_amount, _tx_params(acc))

  token_indices = list(range(len(tokens)))
  n_tokens_cycle = cycle(token_indices)

  token_indices_shifted = rotate(list(range(len(tokens))), 1)
  n_tokens_cycle_shifted = cycle(token_indices_shifted)

  accounts_cycle = cycle(accounts)

  for index, (account, token_from, token_to) in enumerate(zip(accounts_cycle, n_tokens_cycle, n_tokens_cycle_shifted)):
    token_amount = get_exchange_token_amount(tokens[token_from])
    swap.exchange(token_from, token_to, token_amount, 0, _tx_params(account))
    if index >= tx_limit:
      break

def all():
  pool_name = os.environ['DEPLOYMENT_POOL_NAME']
  network = os.environ['DEPLOYMENT_NETWORK']
  sim_iters = int(os.environ.get('SIMULATION_ITERS', 10))
  
  pool = get_pool_contracts(pool_name, network)

  test_accounts = get_test_accounts(network)
  [exchange_accounts, deposit_accounts] = generate_account_groups(sample(list(test_accounts), len(test_accounts)), 2)

  generate_deposit_activity(pool, deposit_accounts)

  generate_exchange_activity(pool, exchange_accounts, sim_iters)

def deposit():
  pool_name = os.environ['DEPLOYMENT_POOL_NAME']
  network = os.environ['DEPLOYMENT_NETWORK']
  
  pool = get_pool_contracts(pool_name, network)

  test_accounts = get_test_accounts(network)
  generate_deposit_activity(pool, test_accounts)


def swap():
  pool_name = os.environ['DEPLOYMENT_POOL_NAME']
  network = os.environ['DEPLOYMENT_NETWORK']
  sim_iters = int(os.environ.get('SIMULATION_ITERS', 10))
  
  pool = get_pool_contracts(pool_name, network)

  test_accounts = get_test_accounts(network)
  generate_exchange_activity(pool, test_accounts, sim_iters)

def sim_all_pools():
  network = os.environ['DEPLOYMENT_NETWORK']
  sim_iters = int(os.environ.get('SIMULATION_ITERS', 10))

  test_accounts = get_test_accounts(network)
  [exchange_accounts, deposit_accounts] = generate_account_groups(sample(list(test_accounts), len(test_accounts)), 2)

  pools_names = get_all_pools_names()
  
  i = 0
  while i < sim_iters:
    pool_index = randrange(len(pools_names))
    pool_name = pools_names[pool_index]
    pool = get_pool_contracts(pool_name, network)

    generate_deposit_activity(pool, deposit_accounts)

    generate_exchange_activity(pool, exchange_accounts, 5)
    i += 1
