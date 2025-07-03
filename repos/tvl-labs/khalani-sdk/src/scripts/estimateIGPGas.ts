import { ethers } from 'ethers-v6'
import { HyperlaneCore, MultiProvider } from '@hyperlane-xyz/sdk'
import config from '@config'
import { Network } from '@constants/Networks'
import * as dotenv from 'dotenv'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'

dotenv.config()

const privateKey = KHALANI_PRIVATE_KEY_HEX

export interface HyperlaneConfig {
  multiProvider: MultiProvider
  hyperlaneCore: HyperlaneCore
}

function removeFirstTwoChars(input: string): string {
  if (input.length < 2) {
    throw new Error('Input string must be at least two characters long')
  }
  return input.slice(2)
}

export function addressToBytes32(address: string): string {
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum address')
  }
  return ethers.zeroPadValue(address, 32)
}

async function constructDispatchedMessage() {
  const originChainId = 17000
  const publisherAddress = '0x16b466f7b19591a9d8500695cc54d7d0fe0b81eb'
  const tokenAddress = '0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626'
  const depositorAddress = '0xc13113E56E00050327Be3AD164185103541f1903'
  const amount = ethers.parseUnits('10', 18)
  const nonce = 1

  // DEPOSIT_EVENT hash
  const DEPOSIT_EVENT = ethers.keccak256(
    ethers.toUtf8Bytes('AssetReserveDeposit'),
  )

  // Define the types for encoding
  const eventDataType =
    'tuple(address tokenAddress, uint256 amount, address depositorAddress)'
  const xChainEventType =
    'tuple(address publisher, uint256 originChainId, bytes32 eventHash, ' +
    'bytes eventData, uint256 nonce)'

  // Encode the eventData as a dynamic type (bytes)
  const eventDataEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    [eventDataType],
    [
      {
        tokenAddress: tokenAddress,
        amount: amount,
        depositorAddress: depositorAddress,
      },
    ],
  )

  // Construct the XChainEvent
  const xChainEventEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    [xChainEventType],
    [
      {
        publisher: publisherAddress,
        originChainId: originChainId,
        eventHash: DEPOSIT_EVENT,
        eventData: eventDataEncoded,
        nonce: nonce,
      },
    ],
  )

  const parsedMessage =
    '0x000000000000000000000000000000000000000000000000000000000000002' +
    removeFirstTwoChars(xChainEventEncoded)

  console.log(
    'Correctly constructed message with dynamic offsets:',
    parsedMessage,
  )
  return xChainEventEncoded
}

export async function estimateIGPGas(
  mockMailboxAddress: string,
): Promise<string> {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === Network.Khalani,
  )?.rpcUrls[0]
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(privateKey, provider)

  const mailboxAbi = [
    'function dispatchMessage(uint32 origin, bytes32 sender, bytes calldata message) external',
  ]
  const mockMailboxInstance = new ethers.Contract(
    mockMailboxAddress,
    mailboxAbi,
    wallet,
  )

  const dispatchedMessage = await constructDispatchedMessage()
  try {
    console.log('Sending transaction...')
    const txResponse = await mockMailboxInstance.dispatchMessage(
      17000,
      addressToBytes32('0x16b466f7b19591a9d8500695cc54d7d0fe0b81eb'),
      dispatchedMessage,
      { gasLimit: ethers.parseUnits('2000000', 'wei') },
    )

    console.log('Transaction sent:', txResponse.hash)

    const receipt = await txResponse.wait()
    console.log('Transaction mined. Receipt:', receipt)

    const gasUsed = receipt.gasUsed
    console.log('Gas Used:', gasUsed.toString())
    return gasUsed.toString()
  } catch (error: any) {
    console.error('Error sending transaction:', error.message)
    if (error.info) {
      console.error('Error info:', error.info)
    }
    throw error
  }
}

const MOCK_MAILBOX_ADDRESS = '0xecc05A6c58729Ba11B2b6bE7E459314E32BA1fbD'
estimateIGPGas(MOCK_MAILBOX_ADDRESS)
  .then((gas) => console.log('Estimated Gas:', gas))
  .catch((error) => console.error('Error:', error.message))
