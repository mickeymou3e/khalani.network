import { ContractFactory, Overrides, Signer } from 'ethers'

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'
import * as WCKBJSON from '../../../../build/contracts/WCKB.json'
import { WCKB, WCKB__factory } from '../../../../src/contracts'

import { getDeploymentDataPath, overrideData } from '../../utils'

import { WCKBDeploymentData } from './types'
import { WCKB_CONTRACTS_DIR } from './constants'

export async function deploy(
    deployer: Signer,
    transactionOverrides: Overrides,
): Promise<WCKB['address']> {
    console.log('[Tokens][wCKB] Deploy')
    const factory = new ContractFactory(
        JSON.stringify(prepare_contract_abi(WCKBJSON.abi)),
        WCKBJSON.bytecode,
        deployer
    ) as WCKB__factory


    const deployTransaction = factory.getDeployTransaction(
        transactionOverrides
    )

    const transactionResult = await deployer.sendTransaction(deployTransaction)
    const receipt = await transactionResult.wait()

    const tokenAddress = receipt.contractAddress

    console.log('[Tokens][wCKB] Deployed', tokenAddress)

    return tokenAddress
}

export async function  deployAll(
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  try {
    const wCKB = await deploy(deployer, transactionOverrides)
    
    const path = getDeploymentDataPath(WCKB_CONTRACTS_DIR, network)
    overrideData<WCKBDeploymentData>(path, {
      wCKB,
    })
  } catch(error) {
    console.error(error)
  }
}
