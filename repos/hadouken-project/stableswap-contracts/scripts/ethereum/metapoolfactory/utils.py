import json

from typing import List

from brownie import Registry, AddressProvider, Swaps, PoolInfo
from brownie.project.main import get_loaded_projects

def get_metapool_factory_path():
  project = get_loaded_projects()[0]
  metapool_factory_path = project._path.joinpath("contracts/metapool-factory")

  return metapool_factory_path

def get_metapool_factory_data_config_path(network):
  metapool_factory_path = get_metapool_factory_path()
  metapool_factory_data_config_path = metapool_factory_path.joinpath(f"metapoolfactorydata.{network}.json")

  return metapool_factory_data_config_path

def get_metapool_factory_data_template_config_path(network):
  metapool_factory_path = get_metapool_factory_data_config_path()
  metapool_factory_data_config_path = metapool_factory_path.joinpath("metapoolfactorydata.json")

  return metapool_factory_data_config_path

def get_json_data(json_path):
  data = {}
  
  if json_path.exists():
    with json_path.open("r") as fp:
      data = json.load(fp)

  return data

def get_metapool_factory_data(network):
    metapool_factory_data_config_path = get_metapool_factory_data_config_path(network)
    metapool_factory_data = get_json_data(metapool_factory_data_config_path)

    return metapool_factory_data
