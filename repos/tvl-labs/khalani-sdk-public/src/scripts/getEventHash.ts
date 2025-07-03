import { ethers } from 'ethers-v6'
import * as dotenv from 'dotenv'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'
import config from '@config'
import { Network } from '@constants/Networks'
import { MTOKEN_CROSSCHAIN_ADAPTER_ABI } from '@artifacts/MTokenCrossChainAdapterArtifact'

dotenv.config()

const PRIVATE_KEY = KHALANI_PRIVATE_KEY_HEX ?? ''

async function getEventHash(sourceChain: Network) {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === sourceChain,
  )?.rpcUrls[0]
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  const MTokenCrossChainAdapter = new ethers.Contract(
    '0xc8b7E10A48797F101F387FFa327cA72f8DAEd9D3',
    MTOKEN_CROSSCHAIN_ADAPTER_ABI as any,
    wallet,
  )

  try {
    const eventHash = await MTokenCrossChainAdapter.getWithdrawEventType()
    console.log(`Event hash for withdraw:`, eventHash)
    return eventHash.toString()
  } catch (error) {
    console.error('Error retrieving gas amount:', error)
  }
}

;(async () => {
  const sourceChainId = Network.Khalani

  await getEventHash(sourceChainId)
})()
