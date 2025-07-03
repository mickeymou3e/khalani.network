import { MTOKEN_ABI } from '@artifacts/MTokenArtifact'
import config from '@config'
import { Network } from '@constants/Networks'
import { findMToken } from '@utils/token'
import { Contract, JsonRpcProvider } from 'ethers-v6'

export async function waitForMinting(
  spokeToken: { symbol: string; chainId: string },
  expectedBalance: bigint,
  account: string,
  fallbackFunction: () => Promise<void>,
  timeout = 60000,
  interval = 2000,
) {
  if (!account) throw new Error('Account address is required')
  if (!expectedBalance || expectedBalance <= 0n)
    throw new Error('Expected balance must be a positive value')
  if (interval < 100) throw new Error('Interval must be at least 100ms')

  const startTime = Date.now()
  const { symbol, chainId } = spokeToken
  const mToken = findMToken(symbol, chainId)

  if (!mToken) {
    throw new Error(
      `mToken not found for symbol: ${symbol}, chainId: ${chainId}`,
    )
  }

  const arcadiaChainProvider = new JsonRpcProvider(
    config.supportedChains.find(
      (chain) => chain.chainId === Network.Khalani,
    )?.rpcUrls[0],
  )

  const mTokenContract = new Contract(
    mToken.address,
    MTOKEN_ABI,
    arcadiaChainProvider,
  )

  while (Date.now() - startTime < timeout) {
    const mTokenBalance = await mTokenContract.balanceOf(account)
    const success = mTokenBalance >= expectedBalance

    if (success) {
      try {
        await fallbackFunction()
      } catch (error) {
        console.error('Error in fallback function:', error)
      }
      return true
    }

    console.log(
      `Balance check: Current balance ${mTokenBalance}, Expected: ${expectedBalance}`,
    )
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error('Timeout: Logic did not succeed within the specified time.')
}
