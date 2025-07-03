import { ethers } from 'ethers-v6'
import * as dotenv from 'dotenv'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'

dotenv.config()
const PRIVATE_KEY = KHALANI_PRIVATE_KEY_HEX ?? ''

const MAILBOX_ABI = ['function localDomain() external view returns (uint32)']

const RPC_URLS: Record<string, string> = {
  khalani: 'https://rpc.khalani.network',
  holesky: 'https://ethereum-holesky-rpc.publicnode.com',
}

async function getMailboxLocalDomain(
  chainName: string,
  mailboxAddress: string,
) {
  // 1) Create a provider & wallet for the chain you want to call
  const providerUrl = RPC_URLS[chainName]
  if (!providerUrl) {
    throw new Error(`No RPC URL found for chain: ${chainName}`)
  }
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

  // 2) Attach to the mailbox contract with minimal ABI
  const mailboxContract = new ethers.Contract(
    mailboxAddress,
    MAILBOX_ABI,
    wallet,
  )

  try {
    // 3) Call the localDomain() function
    const localDomain: number = await mailboxContract.localDomain()
    console.log(`Mailbox at ${mailboxAddress} has localDomain = ${localDomain}`)
    return localDomain
  } catch (error) {
    console.error('Error retrieving local domain:', error)
    return null
  }
}

// Example usage
;(async () => {
  const chainName = 'holesky'
  const mailboxAddress = '0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc'

  await getMailboxLocalDomain(chainName, mailboxAddress)
})()
