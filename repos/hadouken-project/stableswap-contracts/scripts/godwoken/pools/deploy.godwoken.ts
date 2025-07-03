import path from 'path'

import { ContractFactory, Signer, Overrides } from 'ethers';

import Config from '../../../config.json'

import { SwapTemplateBase } from '../../../src/contracts';

import { deploy as deployHadoukenToken } from '../tokens/HadoukenToken/deploy.godwoken'

import { getData, getDataPath, getDeploymentDataPath, overrideData, wait } from '../utils';
import { getPoolContractCompiled, getPoolContractName } from './utils';

import { ContractCompiled, PoolData, PoolDeploymentData } from './types'
import { POOLS_CONTRACTS_DIR } from './constants'
import { setMinter } from '../tokens/HadoukenToken/methods'
import { getTokensDeploymentDataAll } from '../tokens/batch.godwoken';


export async function deployRaw(
  poolContractCompiled: ContractCompiled,
  lpToken: string,
  tokens: PoolData['tokens'],
  amplification: PoolData['amplification'],
  fee: PoolData['fee'],
  adminFee: PoolData['adminFee'],
  admin: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
    const poolAbi = poolContractCompiled.abi
    const poolBytecode = poolContractCompiled.bytecode
    
    const factory = new ContractFactory(
      poolAbi,
      poolBytecode,
      deployer
    ) as unknown as SwapTemplateBase

    const deployTransaction = factory.getDeployTransaction(
      admin,
      tokens,
      lpToken,
      amplification,
      fee,
      adminFee,
      transactionOverrides
    )

    const transactionResponse = await deployer.sendTransaction(deployTransaction)


    const receipt = await transactionResponse.wait()

    const poolAddress = receipt.contractAddress

    return poolAddress
}



export async function deploy(
  poolName: string,
  admin: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[Pool][${poolName}] Deploy`)
  const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
  const poolDataPath = getDataPath(poolContractDir)
  const poolData = getData<PoolData>(poolDataPath)

  if (poolData) {
    const { 
      lpToken: { 
        name: lpTokenName,
        symbol: lpTokenSymbol,
      },
      tokens: tokenNames,
      amplification,
      fee,
      adminFee,
    } = poolData

    const tokensDeploymentData = getTokensDeploymentDataAll(network)
    const tokens = tokenNames.map(tokenName => (tokensDeploymentData ?? {})[tokenName])
    console.log(tokens)  
    const poolContractName = getPoolContractName(poolName)
    const poolContractCompiled = getPoolContractCompiled(poolContractName)
    
    const lpToken = await deployHadoukenToken(lpTokenName, lpTokenSymbol, network, deployer, transactionOverrides)
    await wait(Config.timeout)

    if (lpToken) {
      console.log(`[Pool][${poolName}] tokens`, tokens)
      const pool = await deployRaw(
        poolContractCompiled,
        lpToken,
        tokens,
        amplification,
        fee,
        adminFee,
        admin,
        deployer,
        transactionOverrides
      )
      await wait(Config.timeout)

      await setMinter(lpToken, pool, deployer, transactionOverrides)
      await wait(Config.timeout)

      const deploymentDataPath = getDeploymentDataPath(poolContractDir, network)
      overrideData<PoolDeploymentData>(deploymentDataPath, {
        [poolContractName]: pool,
      })
    
      console.log(`[Pool][${poolName}] Deployed`, pool)
    
      return { pool, lpToken, tokens }
    }
  }
  
  return null
}
