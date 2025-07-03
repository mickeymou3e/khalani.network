import { Token } from './token.types'

export abstract class BaseTokenService {
  constructor(private readonly tokens: Token[]) {}

  public findTokenBySymbol(symbol: string): Token {
    const result = this.tokens.find(
      (token) =>
        token.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase(),
    )
    if (!result) throw new Error(`Token with symbol ${symbol} was not found!`)
    return result
  }

  public findTokenByAddress(address: string): Token {
    const result = this.tokens.find(
      (token) =>
        token.address.toLocaleLowerCase() === address.toLocaleLowerCase(),
    )
    if (!result) throw new Error(`Token with address ${address} was not found!`)
    return result
  }
}
