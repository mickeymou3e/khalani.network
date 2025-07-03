import {  SwapPair, SwapPossibility } from '../../types/schema'

export function addSwapPossibility(
  poolId: string,
  tokenAddress: string,
  quoteTokensAddresses: string[]
): SwapPossibility {
  let id = tokenAddress

  let swapPossibility = SwapPossibility.load(id)

  if (!swapPossibility) {
    swapPossibility = new SwapPossibility(id)
  }

  let quotes = swapPossibility.quotes
  let newQuotes: string[] = []

  if (quotes && quotes.length > 0) {
    for (let i = 0; i < quotes.length; ++i) {
      newQuotes.push(quotes[i])
    }
  }

  for (let i = 0; i < quoteTokensAddresses.length; ++i) {
    let isInsideQuote = false
    for (let j = 0; j < newQuotes.length; ++j) {
      if (newQuotes[j] === quoteTokensAddresses[i]) {
        isInsideQuote = true
      }
    }

    let swapPair = SwapPair.load(
      tokenAddress + quoteTokensAddresses[i] + poolId
    )

    if (!isInsideQuote && quoteTokensAddresses[i] !== id) {
      if (!swapPair) {
        swapPair = new SwapPair(tokenAddress + quoteTokensAddresses[i] + poolId)
        swapPair.address = quoteTokensAddresses[i]
        swapPair.poolId = poolId
        swapPair.save()
        newQuotes.push(swapPair.id)
      }
    }
  }

  swapPossibility.quotes = newQuotes
  swapPossibility.save()

  return swapPossibility as SwapPossibility
}
