import { ethers } from 'ethers'
import {
  ChainMetadata,
  ChainName,
  HyperlaneCore,
  MultiProvider,
} from '@hyperlane-xyz/sdk'
import { chainConfigs } from './hyperlane/chainConfigs'
export interface HyperlaneConfig {
  multiProvider: MultiProvider
  hyperlaneCore: HyperlaneCore
}

export function addressToBytes32(address: string): string {
  if (!ethers.utils.isAddress(address)) {
    throw new Error('Invalid Ethereum address')
  }
  return ethers.utils.hexZeroPad(address, 32)
}

export async function estimateInterchainGasPayment(
  hyperlaneCore: HyperlaneCore,
  origin: ChainName,
  destination: ChainName,
  recipientBytes32: string,
  messageBody: string,
): Promise<ethers.BigNumber> {
  const gasPayment = await hyperlaneCore.quoteGasPayment(
    origin,
    destination,
    recipientBytes32,
    messageBody,
  )
  return gasPayment
}

export async function estimateDispatchFee(
  hyperlaneCore: HyperlaneCore,
  origin: ChainName,
  destinationDomainId: number,
  recipientBytes32: string,
  messageBody: string,
): Promise<ethers.BigNumber> {
  // Get the Mailbox contract for the origin chain
  const mailbox = hyperlaneCore.getContracts(origin).mailbox

  // Estimate the dispatch fee using quoteDispatch
  const dispatchFee = await mailbox['quoteDispatch(uint32,bytes32,bytes)'](
    destinationDomainId,
    recipientBytes32,
    messageBody,
  )

  return dispatchFee
}

export function setupHyperlane() {
  console.log('Setting hyperlane setup')
  // Generate chainMetadata and addressesMap from chainConfigs
  const chainMetadata: any = {}
  const addressesMap: any = {}

  for (const chainConfig of chainConfigs) {
    const chainName = chainConfig.name as ChainName

    chainMetadata[chainName] = {
      name: chainName,
      chainId: chainConfig.chainId,
      domainId: chainConfig.domainId,
      rpcUrls: [{ http: chainConfig.rpcUrl }],
      protocol: 'ethereum' as any,
    } as ChainMetadata

    addressesMap[chainName] = {
      mailbox: chainConfig.mailboxAddress,
      interchainGasPaymaster: chainConfig.interchainGasPaymasterAddress,
    }
  }

  // Initialize MultiProvider and HyperlaneCore
  const multiProvider = new MultiProvider(chainMetadata)
  const hyperlaneCore = HyperlaneCore.fromAddressesMap(
    addressesMap,
    multiProvider,
  )

  console.log('Hyperlane setup set')

  return { hyperlaneCore, multiProvider }
}
