export const formatTokenSymbol = (
  tokenSymbol: string | undefined,
): string | undefined => {
  const match = tokenSymbol?.match(/[A-Z]+/)
  if (!match) return

  return match[0]
}
