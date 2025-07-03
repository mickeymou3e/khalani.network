import config from '@config'
import { Network } from '@constants/Networks'
import { ethers, JsonRpcProvider, MaxUint256 } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../e2e/config'

const privateKey = KHALANI_PRIVATE_KEY_HEX
const tokenAbi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
]

async function approvePermit2(sourceChain: Network, tokenSymbol: string) {
  try {
    const providerUrl = config.supportedChains.find(
      (chain) => chain.chainId === sourceChain,
    )?.rpcUrls[0]
    const tokenAddress =
      config.tokens.find(
        (token) =>
          token.chainId === sourceChain && token.symbol.includes(tokenSymbol),
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

    const provider = new JsonRpcProvider(providerUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)

    console.log('Approving Permit2 to spend tokens...')
    const tx = await tokenContract.approve(permit2Address, MaxUint256)
    console.log(`Approval transaction sent: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(
      `Approval transaction confirmed in block ${receipt.blockNumber}`,
    )
  } catch (error) {
    console.error('Error approving Permit2:', error)
  }
}

;(async () => {
  await approvePermit2(Network.AvalancheTestnet, 'USDC')
  await approvePermit2(Network.AvalancheTestnet, 'USDT')
  await approvePermit2(Network.AvalancheTestnet, 'DAI')
  await approvePermit2(Network.AvalancheTestnet, 'ETH')

  await approvePermit2(Network.Holesky, 'USDC')
  await approvePermit2(Network.Holesky, 'USDT')
  await approvePermit2(Network.Holesky, 'DAI')
  await approvePermit2(Network.Holesky, 'ETH')
})()
