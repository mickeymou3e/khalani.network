import json

from typing import List

from brownie import Registry, AddressProvider, Swaps, PoolInfo
from brownie.project.main import get_loaded_projects

def get_registry_path():
  project = get_loaded_projects()[0]
  pools_path = project._path.joinpath("contracts/registry")

  return pools_path

def get_registry_data_config_path(network):
  registry_path = get_registry_path()
  registry_data_config_path = registry_path.joinpath(f"registrydata.{network}.json")

  return registry_data_config_path

def get_registry_data_template_config_path(network):
  registry_path = get_registry_path()
  registry_data_config_path = registry_path.joinpath("registrydata.json")

  return registry_data_config_path

def get_json_data(json_path):
  data = {}
  
  if json_path.exists():
    with json_path.open("r") as fp:
      data = json.load(fp)

  return data

def get_registry_data(network):
    registry_data_config_path = get_registry_data_config_path(network)
    registry_data = get_json_data(registry_data_config_path)

    return registry_data


def pack_values(values: List[int]) -> bytes:
    """
    Tightly pack integer values.

    Each number is represented as a single byte within a low-endian bytestring. The
    bytestring is then converted back to a `uint256` to be used in `Registry.add_pool`

    Arguments
    ---------
    values : list
        List of integer values to pack

    Returns
    -------
    int
        32 byte little-endian bytestring of packed values, converted to an integer
    """
    assert max(values) < 256

    return sum(i << c * 8 for c, i in enumerate(values))
