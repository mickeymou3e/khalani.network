
import { BigNumber, ContractFactory, Overrides, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as ERC20JSON from '../../../../build/contracts/ERC20.json'
import { ERC20, ERC20__factory } from '../../../../src/contracts';

import { getData, getDataPath, getDeploymentDataPath, overrideData } from '../../utils'

import { ERC20Data, ERC20DeploymentData } from './types'
import { ERC20_CONTRACTS_DIR } from './constants'
import { mint } from './methods/mint';
import { ScriptRunParameters } from '../../types';
import { balanceOf } from './methods/balance';
import { ScriptRunEnvironment } from '../../../../cli/types';

export async function deploy(
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  deployer: Signer,
  transactionOverrides: Overrides,
):Promise<ERC20['address']> {
  console.log(`[Tokens][ERC20][${tokenSymbol}]  Deploy`)
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(ERC20JSON.abi)),
    ERC20JSON.bytecode,
    deployer
  )  as ERC20__factory;

  const deployTransaction = factory.getDeployTransaction(
    tokenName,
    tokenSymbol,
    tokenDecimals,
    transactionOverrides
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const tokenAddress = receipt.contractAddress
  
  console.log(`[Tokens][ERC20][${tokenSymbol}] Deployed`, tokenAddress)

  return tokenAddress
}

export async function deploySingle(
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  try {
    const deploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)

    const erc20 = await deploy(tokenName, tokenSymbol, tokenDecimals, deployer, transactionOverrides)
    overrideData<ERC20DeploymentData>(deploymentDataPath, {
      [tokenSymbol]: erc20,
    })
  } catch(error) {
    console.error(error)
  }
}

export async function  deployAll(
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  try {
    const dataPath = getDataPath(ERC20_CONTRACTS_DIR)
    const data = getData<ERC20Data>(dataPath)
    const deploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)

    if (data) {
      for (const parameters of data) {
        const { name, symbol, decimals } = parameters
        const erc20 = await deploy(name, symbol, decimals, deployer, transactionOverrides)
        overrideData<ERC20DeploymentData>(deploymentDataPath, {
          [symbol]: erc20,
        })
      }
    }
    
  } catch(error) {
    console.error(error)
  }
}


export async function mintAll({
  network,
  admin,
  deployer,
  provider,
  transactionOverrides,
}: ScriptRunParameters) {
  try {
    const deploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
    const tokensBySymbol = getData<ERC20DeploymentData>(deploymentDataPath)

    if (tokensBySymbol) {
      for (const tokenSymbol of Object.keys(tokensBySymbol)) {
        const tokenAddress = tokensBySymbol[tokenSymbol]
        await mint(tokenSymbol, tokenAddress, admin, deployer, transactionOverrides)
      }
    }
    
  } catch(error) {
    console.error(error)
  }
}

export async function balanceOfAll({
  network,
  address,
  wallet,
  provider,
  transactionOverrides,
}: ScriptRunEnvironment) {
  try {
    const deploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
    const tokensBySymbol = getData<ERC20DeploymentData>(deploymentDataPath)

    let balances: { [key: string]: BigNumber } = {}
    if (tokensBySymbol) {
      for (const tokenSymbol of Object.keys(tokensBySymbol)) {
        const tokenAddress = tokensBySymbol[tokenSymbol]
        const balance = await balanceOf(address, tokenAddress, wallet, transactionOverrides)

        balances[tokenSymbol] = balance
      }
    }
    
    return balances
  } catch(error) {
    console.error(error)
  }
}