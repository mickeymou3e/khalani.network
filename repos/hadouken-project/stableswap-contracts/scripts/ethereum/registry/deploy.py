import os
import json
from brownie import ZERO_ADDRESS, AddressProvider, Registry, PoolInfo, Swaps
from brownie.network.gas.strategies import GasNowScalingStrategy

from scripts.ethereum.utils.tx import _tx_params
from scripts.ethereum.accounts.utils import get_deployer_account
from scripts.ethereum.registry.add_pools import main as add_pools
from scripts.ethereum.registry.utils import get_registry_data, get_registry_data_config_path

# TODO: Metapool Factory deployed for correct operation of Registry 
from scripts.ethereum.metapoolfactory.deploy import main as deploy_metapool_factory

def deploy_registry(network=None, deployer=None):
    """
    Deploy `Registry`, add all current pools, and set the address in `AddressProvider`.
    """
    network = network if network else os.environ['DEPLOYMENT_NETWORK']
    deployer = deployer if deployer else  get_deployer_account(network)
    tx_params = _tx_params(deployer)
    balance = deployer.balance()

    registry_data_config_path = get_registry_data_config_path(network)
    registry_data = get_registry_data(network)

    address_provider_address = registry_data["address_provider_address"]

    if not address_provider_address:
        raise Exception(f"No AddressProvider has been deployed on {network} network")

    provider = AddressProvider.at(address_provider_address)
    registry = Registry.deploy(address_provider_address, ZERO_ADDRESS, tx_params)
    
    # FIX: unable to add SUSD pool to registry
    add_pools(registry, network, deployer)
    provider.set_address(0, registry, tx_params)

    registry_data['registry_address'] = registry.address

    with registry_data_config_path.open("w+") as fp:
        json.dump(registry_data, fp, indent=4, sort_keys=True)

    print(f"Registry deployed to: {registry.address}")
    print(f"Total gas used: {(balance - deployer.balance()) / 1e18:.4f} eth")

def deploy_address_provider(network=None, deployer=None):
    """
    Deploy `AddressProvider`, with admin as deployer account.
    """
    network = network if network else os.environ['DEPLOYMENT_NETWORK']
    deployer = deployer if deployer else  get_deployer_account(network)
    tx_params = _tx_params(deployer)
    balance = deployer.balance()

    addressProvider = AddressProvider.deploy(deployer, tx_params)

    registry_data_config_path = get_registry_data_config_path(network)
    registry_data = get_registry_data(registry_data_config_path)

    registry_data['address_provider_address'] = addressProvider.address

    with registry_data_config_path.open("w+") as fp:
        json.dump(registry_data, fp, indent=4, sort_keys=True)

    print(f"AddressProvider deployed to: {addressProvider.address}")
    print(f"Total gas used: {(balance - deployer.balance()) / 1e18:.4f} eth")


def deploy_pool_info(network=None, deployer=None):
    """
    Deploy `PoolInfo` and set the address in `AddressProvider`.
    """
    network = network if network else os.environ['DEPLOYMENT_NETWORK']
    deployer = deployer if deployer else  get_deployer_account(network)
    tx_params = _tx_params(deployer)

    balance = deployer.balance()

    registry_data_config_path = get_registry_data_config_path(network)
    registry_data = get_registry_data(network)

    address_provider_address = registry_data["address_provider_address"]

    if not address_provider_address:
        raise Exception(f"No AddressProvider has been deployed on {network} network")
    

    address_provider = AddressProvider.at(address_provider_address)
    pool_info = PoolInfo.deploy(address_provider, tx_params)

    if address_provider.max_id() == 0:
        address_provider.add_new_id(pool_info, "PoolInfo Getters", tx_params)
    else:
        address_provider.set_address(1, pool_info, tx_params)
    
    registry_data['pool_info_address'] = pool_info.address

    with registry_data_config_path.open("w+") as fp:
        json.dump(registry_data, fp, indent=4, sort_keys=True)
    
    print(f"PoolInfo deployed to: {pool_info.address}")
    print(f"Total gas used: {(balance - deployer.balance()) / 1e18:.4f} eth")


def deploy_swaps(network=None, deployer=None):
    """
    Deploy `Swaps` and set the address in `AddressProvider`.
    """
    network = network if network else os.environ['DEPLOYMENT_NETWORK']
    deployer = deployer if deployer else  get_deployer_account(network)
    tx_params = _tx_params(deployer)

    balance = deployer.balance()

    registry_data_config_path = get_registry_data_config_path(network)
    registry_data = get_registry_data(network)

    address_provider_address = registry_data["address_provider_address"]

    if not address_provider_address:
        raise Exception(f"No AddressProvider has been deployed on {network} network")

    address_provider = AddressProvider.at(address_provider_address)

    # Calculator is ZERO_ADDRESS. What is Calculator?
    swaps = Swaps.deploy(address_provider, ZERO_ADDRESS, tx_params)

    if address_provider.max_id() == 1:
        address_provider.add_new_id(swaps, "Exchanges", tx_params)
    else:
        address_provider.set_address(2, swaps, tx_params)

    registry_data['swaps_address'] = swaps.address

    with registry_data_config_path.open("w+") as fp:
        json.dump(registry_data, fp, indent=4, sort_keys=True)

    print(f"Swaps deployed to: {swaps.address}")
    print(f"Total gas used: {(balance - deployer.balance()) / 1e18:.4f} eth")

def post_deploy_swaps(network=None, deployer=None):
    """
    AddressProvider should be updated after all things are deployed
    """
    tx_params = _tx_params(deployer)
    
    registry_data = get_registry_data(network)
    
    swaps_address = registry_data['swaps_address']
    swaps = Swaps.at(swaps_address)

    swaps.update_registry_address(tx_params)


def main():
    """
    Deploy all:
    `AddressProvider`
    `Registry`
    `PoolInfo`
    `Swaps`

    `Metapool Factory`
    """
    network = os.environ['DEPLOYMENT_NETWORK']
    deployer = get_deployer_account(network)
    
    # Deployment
    deploy_address_provider(network, deployer)
    deploy_registry(network, deployer)
    deploy_pool_info(network, deployer)
    deploy_swaps(network, deployer)
    
    deploy_metapool_factory(network, deployer)

    # Post Deployment
    post_deploy_swaps(network, deployer)