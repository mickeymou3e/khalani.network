import { ethers } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'

async function sendNativeToken(toAddress: string): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider('https://rpc.khalani.network')

    const wallet = new ethers.Wallet(KHALANI_PRIVATE_KEY_HEX, provider)

    const tx = {
      to: toAddress,
      value: ethers.parseEther('10'),
    }

    const transactionResponse = await wallet.sendTransaction(tx)
    await transactionResponse.wait()

    console.log('Transaction hash:', transactionResponse.hash)
    return transactionResponse.hash
  } catch (error) {
    console.error('Error sending transaction:', error)
    throw error
  }
}

sendNativeToken('0x')
