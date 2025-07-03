from brownie.network.gas.strategies import GasNowScalingStrategy, LinearScalingStrategy

# Transaction params
REQUIRED_CONFIRMATIONS = 1

# 150.0 gwei -> 200.0 gwei
gas_strategy_linear = LinearScalingStrategy(100000000000, 150000000000, 1.2)
gas_strategy_gas_now = GasNowScalingStrategy("standard", "fast")

def _tx_params(account):
  return {
      "from": account,
      "required_confs": REQUIRED_CONFIRMATIONS,
      "gas_price": gas_strategy_gas_now,
      "gas_limit": 6000000,
  }