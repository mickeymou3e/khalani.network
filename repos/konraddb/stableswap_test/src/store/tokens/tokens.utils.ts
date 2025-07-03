import { address } from '@dataSource/graph/utils/formatters'
import { IToken } from '@interfaces/token'

const USDT = {
  name: 'USDT',
  symbol: 'USDT',
}

const USDC = {
  name: 'USDC',
  symbol: 'USDC',
}

const DAI = {
  name: 'DAI',
  symbol: 'DAI',
}

const ETH = {
  name: 'ETH',
  symbol: 'ETH',
}

export const mapTokenNames = (token: IToken): IToken => {
  switch (token.address) {
    case address('0x10a86c9c8cbe7cf2849bfcb0eabe39b3bfec91d4'):
      return {
        ...token,
        id: token?.address,
        name: USDT.name,
        symbol: USDT.symbol,
      }
    case address('0x630acc0a29e325ce022563df69ba7e25eeb1e184'):
      return {
        ...token,
        id: token?.address,
        name: USDC.name,
        symbol: USDC.symbol,
      }
    case address('0xa2370d7afff03e1e2fb77b28fb65532636e0cb61'):
      return {
        ...token,
        id: token?.address,
        name: DAI.name,
        symbol: DAI.symbol,
      }
    case address('0xf0d66bf1260d21fe90329a7a311e84979feb004d'):
      return {
        ...token,
        id: token?.address,
        name: ETH.name,
        symbol: ETH.symbol,
      }
    default:
      return {
        ...token,
        id: token?.address,
        name: token.name,
        symbol: token.symbol,
      }
  }
}
