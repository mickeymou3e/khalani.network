/**
 * A currency is any fungible financial instrument on Ethereum, including `NATIVE_TOKEN_SYMBOL` and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is NATIVE.
 */
export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly NATIVE: Currency = new Currency(
    18,
    'CKB',
    'Nervos Network',
  )

  /**
   * Constructs an instance of the base class `Currency`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  public constructor(decimals: number, symbol?: string, name?: string) {
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

const NATIVE = Currency.NATIVE
export { NATIVE }
