const BUTTON_NAME = 'SWAP'

const TRADE_LABEL = 'Trade crypto'

const NO_DATA_AVAILABLE = 'NO AVAILABLE'

const BALANCE = 'Balance'

const TOO_SMALL_VALUE = '< 0.0001'
const SWAP_DESCRIPTION_TITLE = 'Select asset and enter amount'
const SWAP_DESCRIPTION =
  'After you select asset pair to swap we gonna calculate how much of quote asset you will get'

const TRADE_THROUGH = 'Trade routed through'

const EXCHANGE_RATE = (
  baseTokenName: string,
  quoteTokenName: string,
  quoteTokenValue: string,
): string => `1 ${baseTokenName} = ${quoteTokenValue} ${quoteTokenName}`

const BASE_TOKEN_INPUT_LABEL = 'YOU SWAP'

const QUOTE_TOKEN_INPUT_LABEL = 'YOU RECEIVE'

const USE_AVAILABLE_BUTTON = 'Use available'

const EMPTY = ''

const HIGH_PRICE_IMPACT_TITLE = 'High price impact'
const HIGH_PRICE_IMPACT_DESCRIPTION =
  'This swap will significantly move the market price.'

const INSUFFICIENT_LIQUIDITY_TITLE = 'Insufficient liquidity'
const INSUFFICIENT_LIQUIDITY_DESCRIPTION =
  'There is insufficient liquidity to perform this swap.'

export const messages = {
  SWAP_DESCRIPTION_TITLE,
  SWAP_DESCRIPTION,
  BUTTON_NAME,
  NO_DATA_AVAILABLE,
  BALANCE,
  TRADE_THROUGH,
  EXCHANGE_RATE,
  BASE_TOKEN_INPUT_LABEL,
  QUOTE_TOKEN_INPUT_LABEL,
  USE_AVAILABLE_BUTTON,
  EMPTY,
  TRADE_LABEL,
  TOO_SMALL_VALUE,
  HIGH_PRICE_IMPACT_TITLE,
  HIGH_PRICE_IMPACT_DESCRIPTION,
  INSUFFICIENT_LIQUIDITY_TITLE,
  INSUFFICIENT_LIQUIDITY_DESCRIPTION,
}
