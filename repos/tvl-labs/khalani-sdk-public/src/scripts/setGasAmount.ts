import * as dotenv from 'dotenv'
dotenv.config()

import { ethers } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'
import config from '@config'
import { Network } from '@constants/Networks'
import { parseNetworkEnumToId } from '@utils/network'

const PRIVATE_KEY = KHALANI_PRIVATE_KEY_HEX ?? ''

async function getGasAmount(
  sourceChain: Network,
  destinationChain: Network,
  gasOracleAddress: string,
) {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === sourceChain,
  )?.rpcUrls[0]
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  const sourceChainId = parseNetworkEnumToId(sourceChain)
  const destinationChainId = parseNetworkEnumToId(destinationChain)

  const oracleAbi = [
    'function getGasAmount(uint32 sourceChainId, uint32 destinationChainId) external view returns (uint256)',
  ]
  const gasOracleContract = new ethers.Contract(
    gasOracleAddress,
    oracleAbi,
    wallet,
  )

  try {
    const gasAmount = await gasOracleContract.getGasAmount(
      sourceChainId,
      destinationChainId,
    )
    console.log(
      `Gas amount from ${sourceChainId} to ${destinationChainId}: ${gasAmount.toString()}`,
    )
    return gasAmount.toString()
  } catch (error) {
    console.error('Error retrieving gas amount:', error)
  }
}

async function setGasAmount(
  sourceChain: Network,
  destinationChain: Network,
  newGasAmount: number,
  gasOracleAddress: string,
) {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === sourceChain,
  )?.rpcUrls[0]
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  const sourceChainId = parseNetworkEnumToId(sourceChain)
  const destinationChainId = parseNetworkEnumToId(destinationChain)

  const oracleAbi = [
    'function setGasAmount(uint32 sourceChainId, uint32 destinationChainId, uint256 newGasAmount) external',
  ]
  const gasOracleContract = new ethers.Contract(
    gasOracleAddress,
    oracleAbi,
    wallet,
  )

  try {
    const tx = await gasOracleContract.setGasAmount(
      sourceChainId,
      destinationChainId,
      newGasAmount,
    )
    console.log('Transaction sent. Hash:', tx.hash)

    const receipt = await tx.wait()
    console.log('Transaction mined. Receipt:', receipt)
  } catch (error) {
    console.error('Error setting gas amount:', error)
  }
}

;(async () => {
  const sourceChainId = Network.Khalani
  const destinationChainId = Network.ArbitrumSepolia
  const gasOracleOnSourceChain = '0xDDf94498E34fEDF389c5f992876996B83aE0dfa0'

  // Get current gas amount
  await getGasAmount(sourceChainId, destinationChainId, gasOracleOnSourceChain)

  // Set a new gas amount

  await setGasAmount(
    sourceChainId,
    destinationChainId,
    500000,
    gasOracleOnSourceChain,
  )

  // Verify the new gas amount
  await getGasAmount(sourceChainId, destinationChainId, gasOracleOnSourceChain)
})()
