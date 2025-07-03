from brownie import Contract, Registry, accounts
from brownie.exceptions import VirtualMachineError

from scripts.ethereum.utils.tx import _tx_params
from scripts.ethereum.pools.utils import get_all_pool_data
from scripts.ethereum.registry.utils import pack_values

# modify this prior to mainnet use
# GAUGE_CONTROLLER = "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"

# RATE_METHOD_IDS = {
#     "ATokenMock": "0x00000000",
#     "aETH": "0x71ca337d",  # ratio - requires a rate calculator deployment
#     "cERC20": "0x182df0f5",  # exchangeRateStored
#     "IdleToken": "0x7ff9b596",  # tokenPrice
#     "renERC20": "0xbd6d894d",  # exchangeRateCurrent
#     "yERC20": "0x77c7b8fc",  # getPricePerFullShare
# }


def add_pool(data, registry, deployer, pool_name):
    tx_params = _tx_params(deployer)
    swap = Contract(data["swap_address"])
    token = data["lp_token_address"]
    n_coins = len(data["coins"])
    decimals = pack_values([i.get("decimals", i.get("wrapped_decimals")) for i in data["coins"]])

    # TODO: Add metapool support
    # if "base_pool" in data:
    #     # adding a metapool
    #     registry.add_metapool(swap, n_coins, token, decimals, pool_name, tx_params)
    #     return


    # is_v1 is curve.fi flag to indicate Curve lp token v1
    # in Hadouken only v2 is used but because of tests compatibility preserved in interface
    is_v1 = False

    has_initial_A = hasattr(swap, "intitial_A")
    rate_info = "0x00000000"
    if "wrapped_contract" in data:
        rate_info = RATE_METHOD_IDS[data["wrapped_contract"]]
    
    # TODO: integrate/move rate calculator 
    if "rate_calculator_address" in data:
        # 24-bytes = 20-byte address + 4-byte fn sig
        rate_info = data["rate_calculator_address"] + rate_info[2:]

    if hasattr(swap, "exchange_underlying"):
        wrapped_decimals = pack_values(
            [i.get("wrapped_decimals", i["decimals"]) for i in data["coins"]]
        )
        registry.add_pool(
            swap,
            n_coins,
            token,
            rate_info,
            wrapped_decimals,
            decimals,
            has_initial_A,
            is_v1,
            pool_name,
            tx_params,
        )
    else:
        use_lending_rates = pack_values(["wrapped_decimals" in i for i in data["coins"]])
        registry.add_pool_without_underlying(
            swap,
            n_coins,
            token,
            rate_info,
            decimals,
            use_lending_rates,
            has_initial_A,
            is_v1,
            pool_name,
            tx_params,
        )


def add_gauges(data, registry, deployer):
    pool = data["swap_address"]
    gauges = data["gauge_addresses"]
    gauges += ["0x0000000000000000000000000000000000000000"] * (10 - len(gauges))

    if registry.get_gauges(pool)[0] != gauges:
        registry.set_liquidity_gauges(pool, gauges, {"from": deployer, "gas_price": gas_strategy})


def main(registry, network, deployer):
    """
    * Get pool data from pooldata.json
    * Add new pools to the existing registry deployment
    * Add / update pool gauges within the registry
    """
    deployer = accounts.at(deployer, force=True)

    tx_params = _tx_params(deployer)
    balance = deployer.balance()
    registry = Registry.at(registry)

    # sort keys leaving metapools last
    pool_data = sorted(get_all_pool_data(network).items(), key=lambda item: item[1].get("base_pool", ""))

    print("Adding pools to registry...")

    for name, data in pool_data:
        pool = data["swap_address"]
        if registry.get_n_coins(pool)[0] == 0:
            print(f"\nAdding {name}...")
            add_pool(data, registry, deployer, name)
        else:
            print(f"\n{name} has already been added to registry")

        # No Gauges Deployed
        #
        # gauges = data["gauge_addresses"]
        # gauges = gauges + ["0x0000000000000000000000000000000000000000"] * (10 - len(gauges))

        # if registry.get_gauges(pool)[0] == gauges:
        #     print(f"{name} gauges are up-to-date")
        #     continue

        # print(f"Updating gauges for {name}...")
        # for gauge in data["gauge_addresses"]:
        #     try:
        #         Contract(GAUGE_CONTROLLER).gauge_types(gauge)
        #     except (ValueError, VirtualMachineError):
        #         print(f"Gauge {gauge} is not known to GaugeController, cannot add to registry")
        #         gauges = False
        #         break

        # if gauges:
        #     registry.set_liquidity_gauges(
        #         pool, gauges, {"from": deployer, "gas_price": gas_strategy}
        #     )

    print(f"Total gas used: {(balance - deployer.balance()) / 1e18:.4f} eth")
