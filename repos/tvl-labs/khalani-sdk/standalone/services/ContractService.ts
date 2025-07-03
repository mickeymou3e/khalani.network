import { Contract, InterfaceAbi } from 'ethers-v6'
import { INTENTBOOK_ABI } from '../abis/IntentBookArtifact'
import { ERC20_ABI } from '../abis/ERC20Artifact'
import {
  ASSET_RESERVES_ABI,
  ASSET_RESERVES_PERMIT2_ABI,
  ASSET_RESERVES_TRADITIONAL_ABI,
} from '../abis/AssetReservesArtifact'
import { MTOKEN_ABI } from '../abis/MTokenArtifact'
import { WalletService } from './WalletService'
import ConfigSchema from '../config/config.schema.json'
import { TokensService } from './TokensService'

export class ContractService {
  private walletService: WalletService | null = null
  private config: typeof ConfigSchema
  private tokensService: TokensService | null = null
  /**
   * Optional wallet state parameter in the constructor.
   * If no wallet is provided, the instance properties remain null.
   */
  constructor(
    config: typeof ConfigSchema,
    walletService?: WalletService,
    tokensService?: TokensService,
  ) {
    if (walletService) {
      this.walletService = walletService
    }
    this.config = config
    if (tokensService) {
      this.tokensService = tokensService
    }
  }

  /**
   * Updates the wallet-dependent properties.
   */
  public updateWallet(walletService: WalletService): void {
    this.walletService = walletService
  }

  public getPermit2Address = (chainId: number): string => {
    const chainIdHex = `0x${chainId.toString(16)}`

    const permit2Addresses = this.config.contracts.permit2 as Record<
      string,
      string
    >

    if (!permit2Addresses[chainIdHex]) {
      throw new Error(`Permit2 address not found for chain ${chainId}`)
    }

    return permit2Addresses[chainIdHex]
  }

  public getAssetReservesAddress = (chainId: number): string => {
    const chainIdHex = `0x${chainId.toString(16)}`

    const addressReservesAddresses = this.config.contracts
      .AssetReserves as Record<string, string>

    if (!addressReservesAddresses[chainIdHex]) {
      throw new Error(`Asset reserves address not found for chain ${chainId}`)
    }

    return addressReservesAddresses[chainIdHex]
  }

  /**
   * Gets the mToken address for a given chain and token.
   * This method retrieves the mToken address that corresponds to a user's deposit
   * of a specific token on a specific chain.
   *
   * @param chainId The chain ID where the token exists.
   * @param tokenAddress The address of the token.
   * @returns The corresponding mToken address.
   */
  public getMTokenAddress(chainId: number, tokenAddress: string): string {
    try {
      if (!this.tokensService) {
        throw new Error('TokensService is not initialized')
      }
      const mToken = this.tokensService.findArcadiaToken(chainId, tokenAddress)
      return mToken.address
    } catch (error) {
      console.error('Error getting mToken address:', error)
      throw error
    }
  }

  /**
   * Returns an ERC20 contract instance using the current signer.
   * Always creates a new instance so that the latest signer is used.
   *
   * @param address - The ERC20 token contract address.
   */
  public getERC20Contract(address: string): Contract {
    if (!this.walletService) {
      throw new Error('WalletService is not initialized')
    }
    const signer = this.walletService.getSigner()
    return new Contract(address, ERC20_ABI, signer)
  }

  /**
   * Returns an MToken contract instance using the current signer.
   *
   * @param address - The mToken contract address.
   */
  public getMTokenContract(address: string): Contract {
    if (!this.walletService) {
      throw new Error('WalletService is not initialized')
    }
    const provider = this.walletService.getArcadiaProvider()
    return new Contract(address, MTOKEN_ABI, provider)
  }

  /**
   * Returns an AssetReserves contract instance using the current signer.
   *
   * @returns Contract instance for the AssetReserves contract.
   */
  public getAssetReservesContract(isTraditionalDeposit = false): Contract {
    if (!this.walletService) {
      throw new Error('WalletService is not initialized')
    }
    const signer = this.walletService.getSigner()
    // Derive the asset reserves address based on the current network:
    const network = this.walletService.getNetwork()
    const address = this.getAssetReservesAddress(Number(network))
    const arAbi = this.getAssetReservesABI<InterfaceAbi>(isTraditionalDeposit)
    return new Contract(address, arAbi, signer)
  }

  /**
   * Returns an IntentBook contract instance using the read-only arcadiaProvider.
   *
   * @returns Contract instance for the IntentBook contract.
   */
  public getIntentBookContract(): Contract {
    if (!this.walletService) {
      throw new Error('WalletService is not initialized')
    }
    const provider = this.walletService.getArcadiaProvider()
    const intentBookAddress = this.config.contracts.IntentBook
    return new Contract(intentBookAddress, INTENTBOOK_ABI, provider)
  }

  public getIntentBookAddress(): string {
    return this.config.contracts.IntentBook
  }

  public getIntentBookABI(): typeof INTENTBOOK_ABI {
    return INTENTBOOK_ABI
  }

  public getMTokenABI(): typeof MTOKEN_ABI {
    return MTOKEN_ABI
  }

  public getAssetReservesABI<T>(isTraditionalDeposit = false): T {
    if (isTraditionalDeposit) {
      return ASSET_RESERVES_TRADITIONAL_ABI as unknown as T
    }
    return ASSET_RESERVES_PERMIT2_ABI as unknown as T
  }
}
