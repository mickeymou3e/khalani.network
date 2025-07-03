import { getFallbackProvider } from '@services/provider/fallbackProvider'

export const fetchTokenAmount = async (
  userAddress: string,
  rpcUrls: string[],
): Promise<bigint> => {
  const provider = getFallbackProvider(rpcUrls)

  try {
    const balance = await provider.getBalance(userAddress)
    return balance
  } catch (e: any) {
    throw new Error(e)
  }
}
