import { BigNumber, ContractFactory, Overrides, Signer } from 'ethers';

import Config from '../../../../config.json'

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as SudtERC20JSON from '../../../../build/contracts/SudtERC20.json'
import {
  SudtERC20,
  SudtERC20__factory,
} from '../../../../src/contracts';

import { getData, getDataPath, getDeploymentDataPath, overrideData, wait } from '../../utils'

import { SudtERC20Data, SudtERC20DeploymentData } from './types'
import { SUDTERC20_CONTRACTS_DIR } from './constants'

const INITIAL_TOTAL_SUPPLY = (decimals: number) => BigNumber.from(10).pow(decimals)

export async function deployRaw(
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenSudtId: number,
  deployer: Signer,
  transactionOverrides: Overrides,
):Promise<SudtERC20['address']> {
  console.log(`[Tokens][SudtERC20][${tokenSymbol}] SudtERC20 Deploy`)
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(SudtERC20JSON.abi)),
    SudtERC20JSON.bytecode,
    deployer
  )  as SudtERC20__factory;

  const deployTransaction = factory.getDeployTransaction(
    tokenName,
    tokenSymbol,
    INITIAL_TOTAL_SUPPLY(tokenDecimals),
    tokenSudtId,
    tokenDecimals,
    transactionOverrides
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const tokenAddress = receipt.contractAddress
  
  console.log(`[Tokens][SudtERC20][${tokenSymbol}] SudtERC20 Deployed`, tokenAddress)

  return tokenAddress
}

export async function  deployAll(
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  try {
    const dataPath = getDataPath(SUDTERC20_CONTRACTS_DIR)
    const data = getData<SudtERC20Data>(dataPath)
    const deploymentDataPath = getDeploymentDataPath(SUDTERC20_CONTRACTS_DIR, network)

    if (data) {
      for (const parameters of data) {
        const { name, symbol, decimals, sudtId } = parameters
        const sudt = await deployRaw(name, symbol, decimals, sudtId, deployer, transactionOverrides)
        await wait(Config.timeout)
        
        overrideData<SudtERC20DeploymentData>(deploymentDataPath, {
          [symbol]: sudt,
        })
      }
    }
    
  } catch(error) {
    console.error(error)
  }
}
