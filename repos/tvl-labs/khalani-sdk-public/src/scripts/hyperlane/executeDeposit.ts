import { SignatureTransfer } from '@uniswap/permit2-sdk'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
import config from '@config'
import { Network } from '@constants/Networks'
import { KHALANI_PRIVATE_KEY_HEX } from '../../e2e/config'
import { ChainName } from '@hyperlane-xyz/sdk'
import {
  addressToBytes32,
  estimateDispatchFee,
  estimateInterchainGasPayment,
  setupHyperlane,
} from '../hyperlaneUtils'

dotenv.config()

const privateKey = KHALANI_PRIVATE_KEY_HEX
const providerUrl = config.supportedChains.find(
  (chain) => chain.chainId === Network.Holesky,
)?.rpcUrls[0]
const tokenAddress = '0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626'
const assetReservesAddress = (
  config.contracts.AssetReserves as {
    [key: string]: string | undefined
  }
)[Network.Holesky]
const permit2Address = (
  config.contracts.permit2 as {
    [key: string]: string | undefined
  }
)[Network.Holesky]
const eventVerifierAddress = (
  config.contracts.eventVerifier as {
    [key: string]: string | undefined
  }
)[Network.Khalani]

if (!assetReservesAddress) {
  throw new Error('Asset reserves contract not found')
}

const provider = new ethers.providers.JsonRpcProvider(providerUrl)

const wallet = new ethers.Wallet(privateKey, provider)

const originChain: ChainName = 'holesky'
const destinationChain: ChainName = 'arcadiatestnet2'

// Initialize Hyperlane
const { hyperlaneCore } = setupHyperlane()

// Contract ABIs
const assetReserveAbi = [
  'function deposit(address token, uint256 amount, uint256 permitNonce, uint256 deadline, bytes signature) external payable',
]
const tokenAbi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
]

// Instantiate the contracts
const assetReserveContract = new ethers.Contract(
  assetReservesAddress,
  assetReserveAbi,
  wallet,
)
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)

// Parameters for the permit and deposit function
const amount = ethers.utils.parseEther('10')
const nonce = Math.floor(Date.now() / 1000)
const deadline = Math.floor(Date.now() / 1000) + 3600
const maxUint256 = ethers.constants.MaxUint256

const permit = {
  permitted: {
    token: tokenAddress,
    amount,
  },
  spender: assetReservesAddress,
  nonce,
  deadline,
}

// Sign the permit using EIP-712
async function signPermit() {
  const chainId = await provider.getNetwork().then((network) => network.chainId)

  if (!permit2Address) {
    throw new Error('Permit2 contract not found')
  }
  const { domain, types, values } = SignatureTransfer.getPermitData(
    permit,
    permit2Address,
    chainId,
  )

  const signature = await wallet._signTypedData(domain, types, values)

  const signerAddress = ethers.utils.verifyTypedData(
    domain,
    types,
    values,
    signature,
  )
  console.log('Expected Signer:', wallet.address)
  console.log('Recovered Signer:', signerAddress)
  if (signerAddress !== wallet.address) {
    console.error('Signature is invalid or generated incorrectly')
  }

  return signature
}

async function executeDeposit() {
  try {
    console.log('Signing permit2')
    const signature = await signPermit()
    console.log('Permit2 signed')

    console.log('Approving permit2')
    await approvePermit2()
    console.log('Permit2 approved')

    const recipientAddress = eventVerifierAddress ?? ''
    const recipientBytes32 = addressToBytes32(recipientAddress)

    const messageBody = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'address'],
      [tokenAddress, amount, wallet.address],
    )

    console.log('Estimating IGP Gas Payment')
    const gasPayment = await estimateInterchainGasPayment(
      hyperlaneCore,
      originChain,
      destinationChain,
      recipientBytes32,
      messageBody,
    )

    console.log('Estimated Interchain Gas Payment:', gasPayment.toString())

    const dispatchFee = await estimateDispatchFee(
      hyperlaneCore,
      originChain,
      parseInt(Network.Khalani, 16),
      recipientBytes32,
      messageBody,
    )

    console.log('Estimated Dispatch Fee:', dispatchFee.toString())

    const totalValue = gasPayment.add(dispatchFee)
    console.log(
      'Total Value (gasPayment + dispatchFee):',
      totalValue.toString(),
    )

    const gasLimit = await assetReserveContract.estimateGas.deposit(
      tokenAddress,
      amount,
      nonce,
      deadline,
      signature,
    )

    console.log('Estimated Gas Limit:', gasLimit.toString())

    const tx = await assetReserveContract.deposit(
      tokenAddress,
      amount,
      nonce,
      deadline,
      signature,
      {
        value: totalValue,
        gasLimit: gasLimit,
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

async function approvePermit2() {
  try {
    console.log('Approving Permit2 to spend tokens...')
    const tx = await tokenContract.approve(permit2Address, maxUint256)
    console.log(`Approval transaction sent: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(
      `Approval transaction confirmed in block ${receipt.blockNumber}`,
    )
  } catch (error) {
    console.error('Error approving Permit2:', error)
  }
}

executeDeposit()

// To run use this script:
// npx tsx src/scripts/hyperlane/executeDeposit.ts
