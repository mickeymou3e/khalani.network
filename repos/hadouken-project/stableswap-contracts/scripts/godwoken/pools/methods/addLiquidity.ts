import fs from 'fs'
import path from 'path'

import { Signer, Overrides, BigNumber } from 'ethers';

import { getData, getDataPath, getDeploymentDataPath, wait } from '../../utils';
import { getPoolContractCompiled, getPoolContractName } from '../utils';

import connect from '../connect'

import Config from '../../../../config.json'

import { PoolData, PoolDeploymentData } from '../types'
import { POOLS_CONTRACTS_DIR } from '../constants'
import { ERC20_CONTRACTS_DIR } from '../../tokens/ERC20/constants';
import { ERC20DeploymentData } from '../../tokens/ERC20/types';
import { decimals } from '../../tokens/ERC20/methods/decimals';
import { approve } from '../../tokens/ERC20/methods/approve';

export async function addLiquidity(
  poolName: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[Pool][${poolName}] Add Liquidity`, poolName)

  const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
  const poolDataPath = getDataPath(poolContractDir)
  const poolDeploymentDataPath = getDeploymentDataPath(poolContractDir, network)

  const data = getData<PoolData>(poolDataPath)
  const deploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)

  const tokensDeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
  const tokensBySymbol = getData<ERC20DeploymentData>(tokensDeploymentDataPath)

  const tokens = tokensBySymbol && data && (data.tokens.map(tokenSymbol => [tokenSymbol, tokensBySymbol[tokenSymbol]]) ?? [])

  const poolContractName = getPoolContractName(poolName)
  const poolContractCompiled = getPoolContractCompiled(poolContractName)

  const poolAddress = deploymentData && deploymentData[poolContractName]

  const tokenAmounts: BigNumber[] = []
  for (let [tokenSymbol, tokenAddress] of (tokens ?? [])) {
    const tokenDecimals = await decimals(tokenAddress, deployer, transactionOverrides)
    const tokenAmount = BigNumber.from(10).pow(tokenDecimals)

    console.log(`[Token][${tokenSymbol}] Amount`, tokenAmount.toString())
    if (poolAddress) {
      await approve(tokenAmount, tokenAddress, poolAddress, deployer, transactionOverrides)
      await wait(Config.timeout)
    }
    
    tokenAmounts.push(tokenAmount)
  }

  if (poolAddress) {
    const pool = connect(poolAddress, poolContractCompiled.abi, deployer)

    const addLiquidity = await pool.add_liquidity(tokenAmounts, BigNumber.from(0), transactionOverrides)
    const receipt = await addLiquidity.wait()
    await wait(Config.timeout)
  
    console.log(`[Pool][${poolName}] Add Liquidity`)
    return receipt.transactionHash
  }

  return null
}

export async function addLiquiditySingle(
  tokenAddress: string,
  poolName: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[Pool][${poolName}] Add Liquidity Single ${tokenAddress}`, poolName)

  const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
  const poolDataPath = getDataPath(poolContractDir)
  const poolDeploymentDataPath = getDeploymentDataPath(poolContractDir, network)

  const data = getData<PoolData>(poolDataPath)
  const deploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)

  const tokensDeploymentDataPath = getDeploymentDataPath(ERC20_CONTRACTS_DIR, network)
  const tokensBySymbol = getData<ERC20DeploymentData>(tokensDeploymentDataPath)

  const tokens = tokensBySymbol && data && (data.tokens.map(tokenSymbol => [tokenSymbol, tokensBySymbol[tokenSymbol]]) ?? [])

  const poolContractName = getPoolContractName(poolName)
  const poolContractCompiled = getPoolContractCompiled(poolContractName)

  const poolAddress = deploymentData && deploymentData[poolContractName]

  const tokenAmounts: BigNumber[] = []
  for (let [_tokenSymbol, _tokenAddress] of (tokens ?? [])) {
    if (_tokenAddress === tokenAddress) {
      const tokenDecimals = await decimals(_tokenAddress, deployer, transactionOverrides)
      console.log(`Token ${_tokenSymbol} decimals ${tokenDecimals}`)
      const tokenAmount = BigNumber.from(10).pow(tokenDecimals)

      console.log(`[Token][${_tokenSymbol}] Amount`, tokenAmount.toString())
      if (poolAddress) {
        await approve(tokenAmount, _tokenAddress, poolAddress, deployer, transactionOverrides)
        await wait(Config.timeout)
      }
      
      tokenAmounts.push(tokenAmount)
    } else {
      tokenAmounts.push(BigNumber.from(0))
    }
  }

  if (poolAddress) {
    const pool = connect(poolAddress, poolContractCompiled.abi, deployer)

    const addLiquidity = await pool.add_liquidity(tokenAmounts, BigNumber.from(0), transactionOverrides)
    const receipt = await addLiquidity.wait()
    await wait(Config.timeout)
  
    console.log(`[Pool][${poolName}] Add Liquidity`)
    return receipt.transactionHash
  }

  return null
}
