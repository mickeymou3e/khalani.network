import { ContractFactory, Overrides, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'

import { HadoukenToken__factory } from '../../../../src/contracts';
import HadoukenTokenJSON from '../../../../build/contracts/HadoukenToken.json';

import { getData, getDeploymentDataPath, overrideData } from '../../utils';

import { HADOUKEN_TOKEN_CONTRACTS_DIR } from './constants'
import { HadoukenTokenDeploymentData } from './types'

export async function deployRaw(
  tokenName: string,
  tokenSymbol: string,
  deployer: Signer,
  transactionOverrides: Overrides,

): Promise<string> {
  
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(HadoukenTokenJSON.abi)),
    HadoukenTokenJSON.bytecode,
    deployer
  ) as HadoukenToken__factory

  const deployTransaction = factory.getDeployTransaction(
    tokenName,
    tokenSymbol,
    transactionOverrides
  )

  const transactionResponse = await deployer.sendTransaction(deployTransaction)

  const receipt = await transactionResponse.wait()

  const lpTokenAddress = receipt.contractAddress


  return lpTokenAddress
}


export async function  deploy(
  tokenName: string,
  tokenSymbol: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[LP Token][${tokenSymbol}] Deploy`)
  try {
    const deploymentDataPath = getDeploymentDataPath(HADOUKEN_TOKEN_CONTRACTS_DIR, network)

    const hadoukenToken = await deployRaw(tokenName, tokenSymbol, deployer, transactionOverrides)
    overrideData<HadoukenTokenDeploymentData>(deploymentDataPath, {
      [tokenSymbol]: hadoukenToken,
    })

    console.log(`[LP Token][${tokenSymbol}] Deployed`, hadoukenToken)

    return hadoukenToken
  } catch(error) {
    console.error(error)
  }
}
