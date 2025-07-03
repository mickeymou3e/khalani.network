import * as dotenv from 'dotenv'
dotenv.config()

import config from '@config'
import { PermitTransferFrom, SignatureTransfer } from '@uniswap/permit2-sdk'
import { ethers, Wallet } from 'ethers'
import { Network } from '@constants/Networks'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'

const privateKey = KHALANI_PRIVATE_KEY_HEX
// Parameters for the permit and deposit function
const amount = ethers.utils.parseEther('10')
const nonce = Math.floor(Date.now() / 1000)
const deadline = Math.floor(Date.now() / 1000) + 3600
const maxUint256 = ethers.constants.MaxUint256

const constructProvidersAndContracts = (sourceChain: Network) => {
  const providerUrl = config.supportedChains.find(
    (chain) => chain.chainId === sourceChain,
  )?.rpcUrls[0]
  const tokenAddress =
    config.tokens.find(
      (token) => token.chainId === sourceChain && token.symbol.includes('USDC'),
    )?.address ?? ''
  const assetReservesAddress = (
    config.contracts.AssetReserves as {
      [key: string]: string | undefined
    }
  )[sourceChain]
  const permit2Address =
    (
      config.contracts.permit2 as {
        [key: string]: string | undefined
      }
    )[sourceChain] ?? ''

  if (!assetReservesAddress) {
    throw new Error('Asset reserves contract not found')
  }

  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const wallet = new ethers.Wallet(privateKey, provider)

  // Instantiate the contracts
  const assetReserveContract = new ethers.Contract(
    assetReservesAddress,
    assetReserveAbi,
    wallet,
  )
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)

  const permit = {
    permitted: {
      token: tokenAddress,
      amount,
    },
    spender: assetReservesAddress,
    nonce,
    deadline,
  }

  return {
    provider,
    permit2Address,
    permit,
    wallet,
    tokenContract,
    assetReserveContract,
    tokenAddress,
  }
}

// Contract ABIs
const assetReserveAbi = [
  'function deposit(address token, uint256 amount, uint32 destChain, uint256 permitNonce, uint256 deadline, address recipient, bytes signature) external payable',
]
const tokenAbi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
]

// Sign the permit using EIP-712
async function signPermit(
  provider: ethers.providers.JsonRpcProvider,
  permit2Address: string,
  permit: PermitTransferFrom,
  wallet: Wallet,
) {
  const chainId = await provider.getNetwork().then((network) => network.chainId)

  if (!permit2Address) {
    throw new Error('Permit2 contract not found')
  }
  const { domain, types, values } = SignatureTransfer.getPermitData(
    permit,
    permit2Address,
    Number(chainId),
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

async function executeDeposit(sourceChain: Network, destinationChain: Network) {
  try {
    const {
      provider,
      permit2Address,
      permit,
      wallet,
      tokenContract,
      assetReserveContract,
      tokenAddress,
    } = constructProvidersAndContracts(sourceChain)

    console.log('Signing permit2')
    const signature = await signPermit(provider, permit2Address, permit, wallet)
    console.log('Permit2 signed')

    console.log('Approving permit2')
    await approvePermit2(tokenContract, permit2Address)
    console.log('Permit2 approved')

    const tx = await assetReserveContract.deposit(
      tokenAddress,
      amount,
      parseInt(Network.Khalani),
      nonce,
      deadline,
      wallet.address,
      signature,
      {
        value: ethers.utils.parseEther('0.0001'),
        gasLimit: 2000000,
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

async function approvePermit2(
  tokenContract: ethers.Contract,
  permit2Address: string,
) {
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

executeDeposit(Network.OptimismSepolia, Network.Khalani)
// executeDeposit(Network.AvalancheTestnet, Network.Khalani)

//GAS LIMITS:
//HOLESKY => ARCADIA = 400 000
//FUJI => ARCADIA = ?
