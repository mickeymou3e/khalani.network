import { ethers } from 'ethers'

export async function checkSpokeStatus(
  url: string,
  reserveAddress: string,
  fromBlock: number = 0,
  toBlock: string | number = 'latest',
): Promise<boolean> {
  const provider = new ethers.providers.JsonRpcProvider(url)

  const filter = {
    address: reserveAddress,
    fromBlock,
    toBlock,
  }

  try {
    const logs = await provider.getLogs(filter)
    console.log(`Spoke chain logs for address ${reserveAddress}:`, logs)
    console.log(`Found ${logs.length} log(s) for the given address.`)
    return logs.length > 7
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}

export async function pollSpokeStatus(
  url: string,
  reserveAddress: string,
  fromBlock: number,
  toBlock: string | number = 'latest',
  intervalMs: number = 3000,
  timeoutMs: number = 30000,
): Promise<boolean> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const result = await checkSpokeStatus(
      url,
      reserveAddress,
      fromBlock,
      toBlock,
    )
    if (result) {
      return true
    }
    console.log(
      `No logs found yet. Waiting ${intervalMs}ms before next check...`,
    )
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  return false
}

// Example usage:
;(async () => {
  const alchemyUrl =
    'https://avax-fuji.g.alchemy.com/v2/Cha-uur1WLWVs-6rRtzCuxRtVFeR1LPT'
  const sampleReserveAddress = '0xdf97f8c2914d2f70e42bdd20c13ff39617e9446d'
  const fromBlock = 38090140

  try {
    const spokeStatus = await pollSpokeStatus(
      alchemyUrl,
      sampleReserveAddress,
      fromBlock,
      'latest',
      3000,
      300000,
    )
    console.log('Spoke status:', spokeStatus)
  } catch (error) {
    console.error('Error checking spoke status:', error)
  }
})()
