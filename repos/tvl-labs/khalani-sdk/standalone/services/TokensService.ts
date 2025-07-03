import { IToken, Network } from '../types'
import { WalletService } from './WalletService'
import { formatTokenSymbol } from '../utils/tokenUtils'
import ConfigSchema from '../config/config.schema.json'
export class TokensService {
  private tokens: IToken[] = []
  private config: typeof ConfigSchema
  constructor(
    private walletService: WalletService,
    config: typeof ConfigSchema,
  ) {
    this.config = config
    this.updateTokens()
  }

  private updateTokens() {
    if (!this.config.tokens) {
      throw new Error('Tokens config is not initialized')
    }
    this.tokens = this.config.tokens
  }

  public getTokens(): IToken[] {
    return this.tokens
  }

  public getTokenInDestinyChain({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number
    toChainId: number
    tokenAddress: string
  }): IToken {
    const fromChainIdString = `0x${fromChainId.toString(16)}`
    const toChainIdString = `0x${toChainId.toString(16)}`
    const fromToken = this.tokens.find(
      (token) =>
        token.address === tokenAddress && token.chainId === fromChainIdString,
    )
    if (!fromToken) {
      throw new Error(
        `Token ${tokenAddress} not found on chain ${fromChainIdString}`,
      )
    }

    const fromTokenSymbol = formatTokenSymbol(fromToken.symbol)
    if (!fromTokenSymbol) {
      throw new Error(
        `Token ${tokenAddress} has no symbol on chain ${fromChainIdString}`,
      )
    }

    const foundToToken = this.tokens.find(
      (token) =>
        token.symbol.includes(fromTokenSymbol) &&
        token.chainId === toChainIdString,
    )
    if (!foundToToken) {
      throw new Error(`Destiny token not found on chain ${toChainIdString}`)
    }
    return foundToToken
  }

  public findTokenByAddress(tokenAddress: string, chainId: number): IToken {
    const chainIdHex = `0x${chainId.toString(16)}`

    const token = this.tokens.find(
      (token: IToken) =>
        token.chainId === chainIdHex &&
        token.address.toLowerCase() === tokenAddress.toLowerCase(),
    )

    if (!token) {
      throw new Error(
        `Token not found for address ${tokenAddress} on chain ${chainId}`,
      )
    }

    return token
  }

  public findArcadiaToken(chainId: number, tokenAddress: string) {
    const chainIdHexa = `0x${chainId.toString(16)}`
    const tokenSymbol = this.findTokenByAddress(tokenAddress, chainId).symbol
    const token = this.config.mTokens.find(
      (token) =>
        token.sourceChainId === chainIdHexa && token.symbol === tokenSymbol,
    )
    if (!token) {
      throw new Error(
        `Token not found in arcadia tokens: ${tokenSymbol} on chain ${chainId}`,
      )
    }
    return token
  }

  public getTokenBySymbolAndNetwork(
    tokenSymbol: string,
    network: Network,
  ): IToken {
    const foundToken = this.tokens.find(
      (token) =>
        token.symbol.includes(tokenSymbol) && token.chainId === network,
    )
    if (!foundToken) {
      throw new Error(`Token ${tokenSymbol} not found on network ${network}`)
    }
    return foundToken
  }

  public getTokenOnCurrentNetwork(tokenSymbol: string): IToken {
    if (!this.walletService) {
      throw new Error('Wallet service is not initialized')
    }
    const currentNetwork = this.walletService.getNetwork()
    const foundToken = this.tokens.find(
      (token) =>
        token.symbol.includes(tokenSymbol) && token.chainId === currentNetwork,
    )
    if (!foundToken) {
      throw new Error(
        `Token ${tokenSymbol} not found on network ${currentNetwork}`,
      )
    }
    return foundToken
  }
}
