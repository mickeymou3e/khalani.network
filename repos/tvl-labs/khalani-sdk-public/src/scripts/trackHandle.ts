import { ethers } from 'ethers'
import { SignatureTransfer } from '@uniswap/permit2-sdk'
import * as dotenv from 'dotenv'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'
import config from '@config'
import { Network } from '@constants/Networks'

dotenv.config()

const holeskyConfig = config.supportedChains.find(
  (chain) => chain.chainId === Network.Holesky,
)
const fujiConfig = config.supportedChains.find(
  (chain) => chain.chainId === Network.AvalancheTestnet,
)

// Configuration parameters
const privateKey = KHALANI_PRIVATE_KEY_HEX
const originProviderUrl = holeskyConfig?.rpcUrls[0]
const destinationProviderUrl = fujiConfig?.rpcUrls[0]

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
if (!eventVerifierAddress) {
  throw new Error('Event verifier contract not found')
}

// Contract ABIs
const assetReservesAbi = [
  'function deposit(address token, uint256 amount, uint256 permitNonce, uint256 deadline, bytes signature) external payable',
]
const eventVerifierAbi = [
  'event EventVerified(bytes32 indexed eventHash, uint32 originDomain, address sender)',
]
const tokenAbi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
]

// Parameters for the permit and deposit function
const amount = ethers.utils.parseEther('10')
const permitNonce = Math.floor(Date.now() / 1000)
const deadline = Math.floor(Date.now() / 1000) + 3600
const maxUint256 = ethers.constants.MaxUint256

// Set up ethers providers and wallet
const originProvider = new ethers.providers.JsonRpcProvider(originProviderUrl)
const destinationProvider = new ethers.providers.JsonRpcProvider(
  destinationProviderUrl,
)
const wallet = new ethers.Wallet(privateKey, originProvider)

// Instantiate contracts on origin chain
const assetReserveContract = new ethers.Contract(
  assetReservesAddress,
  assetReservesAbi,
  wallet,
)
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)

// Instantiate EventVerifier contract on destination chain
const eventVerifierContract = new ethers.Contract(
  eventVerifierAddress,
  eventVerifierAbi,
  destinationProvider,
)

console.log(eventVerifierAddress)

const permit = {
  permitted: {
    token: tokenAddress,
    amount,
  },
  spender: assetReservesAddress,
  nonce: permitNonce,
  deadline,
}

// Function to sign the permit using EIP-712
async function signPermit() {
  const chainId = await originProvider
    .getNetwork()
    .then((network) => network.chainId)

  if (!permit2Address) {
    throw new Error('Permit2 contract not found')
  }

  const { domain, types, values } = SignatureTransfer.getPermitData(
    permit,
    permit2Address,
    chainId,
  )

  const signature = await wallet._signTypedData(domain, types, values)

  // Verify signature correctness
  const signerAddress = ethers.utils.verifyTypedData(
    domain,
    types,
    values,
    signature,
  )

  if (signerAddress !== wallet.address) {
    throw new Error('Signature is invalid or generated incorrectly')
  }

  return signature
}

// Function to approve Permit2 contract to spend tokens
async function approvePermit2() {
  console.log('Approving Permit2 to spend tokens...')
  const tx = await tokenContract.approve(permit2Address, maxUint256)
  console.log(`Approval transaction sent: ${tx.hash}`)
  const receipt = await tx.wait()
  console.log(`Approval confirmed in block ${receipt.blockNumber}`)
}

// Main function to execute deposit and track event gas
async function executeDeposit() {
  try {
    const signature = await signPermit()
    // await approvePermit2()

    //Estimate gas for the deposit function
    // const gasEstimate = await assetReserveContract.estimateGas.deposit(
    //   tokenAddress,
    //   amount,
    //   permitNonce,
    //   deadline,
    //   signature,
    // )
    // console.log(`Estimated Gas for deposit: ${gasEstimate.toString()}`)

    // // Add a buffer to the gas estimate for safety
    // const gasLimit = gasEstimate.add(ethers.BigNumber.from('500000'))

    // Execute the deposit function
    const tx = await assetReserveContract.deposit(
      tokenAddress,
      amount,
      permitNonce,
      deadline,
      signature,
      { value: ethers.utils.parseEther('0.03') },
    )
    console.log(`Deposit transaction sent: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(`Deposit transaction confirmed in block ${receipt.blockNumber}`)
    console.log(
      `Gas used for deposit on origin chain: ${receipt.gasUsed.toString()} units`,
    )

    // Track events emitted from EventVerifier on the destination chain
    console.log('Listening for all events on EventVerifier contract...')

    // Setup listener to capture gas used by `handle` function on destination chain
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error(
          'Timeout: EventVerified event was not detected within 10 minutes.',
        )
        resolve()
      }, 600000)

      eventVerifierContract.once(
        'EventVerified',
        async (eventHash, originDomain, sender, event) => {
          try {
            clearTimeout(timeout)
            console.log(
              `EventVerified detected: ${eventHash}, from origin: ${originDomain}, sender: ${sender}`,
            )

            // Get the transaction receipt on the destination chain
            const destReceipt = await destinationProvider.getTransactionReceipt(
              event.transactionHash,
            )

            console.log(
              `Gas used by handle function on destination chain: ${destReceipt.gasUsed.toString()} units`,
            )

            resolve()
          } catch (eventError) {
            reject(eventError)
          }
        },
      )
    })
  } catch (error) {
    console.error('Error executing deposit:', error)
  }
}

executeDeposit()
  .then(() => console.log('Gas tracking completed.'))
  .catch((error) => {
    console.error('Error during gas tracking:', error)
    process.exit(1)
  })
