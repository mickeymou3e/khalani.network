import { ContractFactory, Overrides, Signer } from 'ethers'

import { deployAll as deploySudtERC20All } from './SudtERC20/deploy.godwoken'
import { deployAll as deployWCKBAll } from './wCKB/deploy.godwoken'
import { deployAll as deployERC20All } from './ERC20/batch.godwoken'
import { getData, getDeploymentDataPath, wait } from '../utils'


import Config from "../../../config.json";

import { SUDTERC20_CONTRACTS_DIR } from './SudtERC20/constants'
import { SudtERC20DeploymentData } from './SudtERC20/types'

import { WCKB_CONTRACTS_DIR } from './wCKB/constants'
import { WCKBDeploymentData } from './wCKB/types'
import { ERC20_CONTRACTS_DIR } from './ERC20/constants'
import { ERC20DeploymentData } from './ERC20/types'

export function getTokensDeploymentDataAll(network: string): { [key: string]: string } {
  if (network ===  'godwoken.test') {
    console.log('getTokensDeploymentDataAll', network)
    
    const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
    const erc20Tokens = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

    const sudtDeploymentDataPath = getDeploymentDataPath(SUDTERC20_CONTRACTS_DIR, network)
    const sudtTokens = getData<SudtERC20DeploymentData>(sudtDeploymentDataPath)
  
    const wCKBDeploymentDataPath = getDeploymentDataPath(WCKB_CONTRACTS_DIR, network)
    const wCKBTokens = getData<WCKBDeploymentData>(wCKBDeploymentDataPath)
  
    return {
      ...erc20Tokens,
      ...sudtTokens,
      ...wCKBTokens,
    }
  } else if (network === 'godwoken.prod' || network === 'godwoken.local') {
    const erc20DeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
    const erc20Tokens = getData<ERC20DeploymentData>(erc20DeploymentDataPath)

    return {
      ...erc20Tokens
    }
  }

  return {}
}



export async function  deployAll(
    network: string,
    deployer: Signer,
    transactionOverrides: Overrides
) {
  console.log('network', network)
  if (network ===  'godwoken.test') {
    await deploySudtERC20All(network, deployer, transactionOverrides)
    await wait(Config.timeout)

    await deployWCKBAll(network, deployer, transactionOverrides)
    await wait(Config.timeout)
  } else if (network === 'godwoken.local') {
    await deployERC20All(network, deployer, transactionOverrides)
  }
}