import { ethers } from 'ethers-v6'
import * as dotenv from 'dotenv'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'
import config from '@config'
import { Network } from '@constants/Networks'
import { ASSET_RESERVES_ABI } from '@artifacts/AssetReservesArtifact'

dotenv.config()

const PRIVATE_KEY = KHALANI_PRIVATE_KEY_HEX ?? ''

async function getReserves(sourceChain: Network) {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === sourceChain,
  )?.rpcUrls[0]
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  const assetReservesContract = new ethers.Contract(
    '0x6A9B3fc423603D101d55B3Ce49A801490D2B2c2F',
    ASSET_RESERVES_ABI,
    wallet,
  )

  try {
    const reserves = await assetReservesContract.getReserves(
      '0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626',
    )
    console.log(`Reserves for token USDC is ${reserves}`)
    return reserves.toString()
  } catch (error) {
    console.error('Error retrieving gas amount:', error)
  }
}

;(async () => {
  const sourceChainId = Network.Holesky

  await getReserves(sourceChainId)
})()
