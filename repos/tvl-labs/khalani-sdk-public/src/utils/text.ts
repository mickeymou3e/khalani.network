export const convertDecimalToIntegerDecimal = (
  value: string,
  decimals: number,
): bigint => {
  const splitValue = value.split('.')

  const numbersBeforeDecimal = splitValue[0]

  const numbersAfterDecimal = splitValue.length > 1 ? splitValue[1] : null

  if (numbersAfterDecimal) {
    let afterDecimal
    if (decimals - numbersAfterDecimal.length >= 0) {
      const zerosToAdd = decimals - numbersAfterDecimal.length
      afterDecimal = numbersAfterDecimal + `${'0'.repeat(zerosToAdd)}`
    } else {
      const decimalsToRemove = numbersAfterDecimal.length - decimals
      afterDecimal = numbersAfterDecimal.slice(0, -decimalsToRemove)
    }

    const result = (numbersBeforeDecimal + afterDecimal).replace(/^0+/, '')
    return BigInt(result || 0)
  } else {
    return BigInt(
      numbersBeforeDecimal.replace(/^0+/, '') + `${'0'.repeat(decimals)}`,
    )
  }
}

export const hexToBigInt = (hexString: string) => BigInt(hexString)
