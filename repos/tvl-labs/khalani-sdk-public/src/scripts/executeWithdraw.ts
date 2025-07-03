import * as dotenv from 'dotenv'
dotenv.config()

import { ethers } from 'ethers'
import config from '@config'
import { Network } from '@constants/Networks'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'

import { MTOKEN_MANAGER_ABI } from '@artifacts/MTokenManagerArtifact'

const privateKey = KHALANI_PRIVATE_KEY_HEX
// Parameters for the permit and deposit function
const amount = ethers.utils.parseEther('10')

const constructProvidersAndContracts = (spokeChain: Network) => {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === Network.Khalani,
  )?.rpcUrls[0]
  const tokenAddress =
    config.tokens.find(
      (token) => token.chainId === spokeChain && token.symbol.includes('USDC'),
    )?.address ?? ''
  const mTokenManager = config.contracts.MTokenManager

  if (!mTokenManager) {
    throw new Error('MToken Manager not found')
  }

  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const owner = wallet.address

  // Instantiate the contracts
  const MTokenManager = new ethers.Contract(
    mTokenManager,
    MTOKEN_MANAGER_ABI as any,
    wallet,
  )

  return {
    MTokenManager,
    tokenAddress,
    owner,
  }
}

async function executeWithdraw(spokeChain: Network) {
  try {
    const { MTokenManager, tokenAddress, owner } =
      constructProvidersAndContracts(spokeChain)

    const tx = await MTokenManager.withdrawMToken(
      owner,
      '0xfABC02024f7427C4a22ed44204e472602D821925',
      amount,
      {
        value: ethers.utils.parseEther('0.1'),
        gasLimit: 5000000,
      },
    )

    console.log(`Transaction sent: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(`Gas used: ${receipt.gasUsed.toString()}`)
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`)
  } catch (error) {
    console.error('Error executing deposit:', error)
  }
}

executeWithdraw(Network.ArbitrumSepolia)
// executeDeposit(Network.AvalancheTestnet, Network.Khalani)

//GAS LIMITS:
//HOLESKY => ARCADIA = 400 000
//FUJI => ARCADIA = ?
