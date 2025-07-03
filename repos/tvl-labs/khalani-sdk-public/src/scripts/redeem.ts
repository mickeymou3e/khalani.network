import { ethers } from 'ethers-v6'
import * as dotenv from 'dotenv'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'
import config from '@config'
import { Network } from '@constants/Networks'

dotenv.config()

const PRIVATE_KEY = KHALANI_PRIVATE_KEY_HEX ?? ''

async function redeemCall() {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === Network.Khalani,
  )?.rpcUrls[0]
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  const redeemAbi = ['function redeem(bytes32 receiptId) public']
  const receiptManagerContract = new ethers.Contract(
    '0x0DEE0f760aE1Bacb238D1CF6D472111b026954aA',
    redeemAbi,
    wallet,
  )

  try {
    const tx = await receiptManagerContract.redeem(
      '0xe082ffcb4784824374b2f37a5f762c41c7a998aa096173628f9fb1aaa81a2fa7',
    )
    console.log('Transaction sent. Hash:', tx.hash)

    const receipt = await tx.wait()
    console.log('Transaction mined. Receipt:', receipt)
  } catch (error) {
    console.error('Error setting gas amount:', error)
  }
}

;(async () => {
  await redeemCall()
})()
