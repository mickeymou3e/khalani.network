from brownie import (accounts)

def get_test_accounts(network):
  return {
    'dev': lambda: accounts[1:],
    'goerli': lambda: [accounts.load('hadouken_deployer'), accounts.load('alex'), accounts.load('jane')],
    'rinkeby': lambda: [accounts.load('hadouken_deployer'), accounts.load('alex'), accounts.load('jane')],
  }[network]()


def get_deployer_account(network):
  return {
    'dev': lambda:  accounts[0],
    'goerli': lambda: accounts.load('hadouken_deployer'),
    'rinkeby': lambda: accounts.load('hadouken_deployer')
  }[network]()