import os
import json
from brownie import ZERO_ADDRESS, Factory, AddressProvider
from brownie.network.gas.strategies import GasNowScalingStrategy

from scripts_ethereum.utils.tx import _tx_params
from scripts.ethereum.accounts.utils import get_deployer_account
from scripts.ethereum.registry.add_pools import main as add_pools
from scripts.ethereum.registry.utils import get_registry_data, get_registry_data_config_path


# TODO: (knerushkin) deployed only for a sake of Registry
def main(network=None, deployer=None):
    """
    Deploy `Factory` a metapool factory, allows for permissionless deployment of Curve metapools.

    No deployment config file generated "metapoolfactorydata.{network}.json" 
    Factory achievable only through address provider
    """
    network = network if network else os.environ['DEPLOYMENT_NETWORK']
    deployer = deployer if deployer else  get_deployer_account(network)
    tx_params = _tx_params(deployer)

    registry_data = get_registry_data(network)

    address_provider_address = registry_data["address_provider_address"]

    if not address_provider_address:
        raise Exception(f"No AddressProvider has been deployed on {network} network")

    address_provider = AddressProvider.at(address_provider_address)

    metapool_factory = Factory.deploy(tx_params)

    if address_provider.max_id() == 2:
        address_provider.add_new_id(metapool_factory, "Metapool Factory", tx_params)
    else:
        address_provider.set_address(3, metapool_factory, tx_params)

