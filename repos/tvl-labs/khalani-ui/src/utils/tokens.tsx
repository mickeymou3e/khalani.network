export const formatTokenSymbol = (
  tokenSymbol: string | undefined,
): string | undefined => {
  const match = tokenSymbol?.match(/[A-Z]+/)
  if (!match) return

  return match[0]
}

export const formatFullTokenSymbol = (
  tokenSymbols: string[] | undefined,
): string | undefined =>
  tokenSymbols?.map((token) => formatTokenSymbol(token)).join(' - ')
