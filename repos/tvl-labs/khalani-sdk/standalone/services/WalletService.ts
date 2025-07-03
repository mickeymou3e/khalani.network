import { Network } from '../types'
import { JsonRpcProvider, Signer } from 'ethers-v6'
import ConfigSchema from '../config/config.schema.json'
import { NetworkType } from '../config'

export class WalletService {
  public arcadiaProvider: JsonRpcProvider
  public provider: JsonRpcProvider | null = null
  public signer: Signer | null = null
  public userAddress: string | null = null
  public network: Network | null = null
  public hubChain: Network
  private config: typeof ConfigSchema
  private networkType: NetworkType

  public get isConnected(): boolean {
    return (
      !!this.provider && !!this.signer && !!this.userAddress && !!this.network
    )
  }

  constructor(config: typeof ConfigSchema, networkType: NetworkType) {
    // Initialize arcadiaProvider in constructor
    this.config = config
    this.networkType = networkType
    this.hubChain = this.getHubChain()
    this.arcadiaProvider = this.createArcadiaProvider()
  }

  public getHubChain(): Network {
    switch (this.networkType) {
      case NetworkType.mainnet:
        return Network.ArcadiaMainnet
      case NetworkType.testnet:
        return Network.Khalani
      case NetworkType.devnet:
        return Network.Local
      default:
        throw new Error('Invalid network type')
    }
  }

  public getArcadiaRPCUrl(): string {
    const rpcUrl = this.config.supportedChains.find(
      (chain) => chain.chainId === this.hubChain,
    )?.rpcUrls[0]
    if (!rpcUrl) {
      throw new Error('Khalani RPC URL not found in config')
    }
    return rpcUrl
  }

  public getMedusaRPCUrl(): string {
    const rpcUrl = this.config.medusa.apiUrl
    if (!rpcUrl) {
      throw new Error('Medusa RPC URL not found in config')
    }
    return rpcUrl
  }

  /**
   * Returns information about the Arcadia chain.
   * @returns Object containing name, chainId, and rpcUrl for the Arcadia chain
   */
  public getArcadiaChainInfo(): {
    name: string
    chainId: number
    rpcUrl: string[]
  } {
    const arcadiaChain = this.config.supportedChains.find(
      (chain) => chain.chainId === this.hubChain,
    )

    if (!arcadiaChain) {
      throw new Error('Arcadia chain information not found in config')
    }

    return {
      name: arcadiaChain.chainName,
      chainId: arcadiaChain.id,
      rpcUrl: arcadiaChain.rpcUrls,
    }
  }

  /**
   * Update the provider using a JsonRpcProvider instance.
   */
  public updateProvider(provider: JsonRpcProvider): void {
    if (!provider) {
      console.error('No provider found')
      return
    }
    this.provider = provider
  }

  /**
   * Update the signer using the signer .
   */
  public updateSigner(signer: Signer): void {
    if (!signer) {
      console.error('Signer is missing')
      return
    }
    this.signer = signer
  }

  /**
   * Update network and user address.
   */
  public updateNetworkAndAddress(
    userAddress: string | null,
    network: Network,
  ): void {
    if (!this.provider || !this.signer) {
      console.error('Provider or signer not initialized')
      return
    }
    this.userAddress = userAddress
    if (!network) {
      console.error('Network is missing')
      return
    }
    this.network = network
  }

  /**
   * Returns the current wallet data.
   * @throws Error if any wallet component is not initialized
   */
  public getWalletData(): {
    arcadiaProvider: JsonRpcProvider
    provider: JsonRpcProvider | null
    signer: Signer | null
    userAddress: string | null
    network: Network | null
  } {
    return {
      arcadiaProvider: this.arcadiaProvider,
      provider: this.provider,
      signer: this.signer,
      userAddress: this.userAddress,
      network: this.network,
    }
  }

  public getArcadiaProvider(): JsonRpcProvider {
    return this.arcadiaProvider
  }

  private createArcadiaProvider(): JsonRpcProvider {
    const arcadiaChain = this.config.supportedChains.find(
      (chain) => chain.chainId === this.hubChain,
    )
    if (!arcadiaChain || !arcadiaChain.rpcUrls[0]) {
      throw new Error('Arcadia RPC URL not found in config')
    }

    return new JsonRpcProvider(arcadiaChain.rpcUrls[0])
  }

  /**
   * Get the provider instance.
   * @throws Error if provider is not initialized
   */
  public getProvider(): JsonRpcProvider {
    if (!this.provider) {
      throw new Error('Provider not initialized')
    }
    return this.provider
  }

  /**
   * Get the signer instance.
   * @throws Error if signer is not initialized
   */
  public getSigner(): Signer {
    if (!this.signer) {
      throw new Error('Signer not initialized')
    }
    return this.signer
  }

  /**
   * Get the user's wallet address.
   * @throws Error if user address is not set
   */
  public getUserAddress(): string {
    if (!this.userAddress) {
      throw new Error('User address not set')
    }
    return this.userAddress
  }

  /**
   * Get the current network.
   * @throws Error if network is not set
   */
  public getNetwork(): Network {
    if (!this.network) {
      throw new Error('Network not set')
    }
    return this.network
  }
}
