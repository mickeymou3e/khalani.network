import { Network } from '@constants/Networks'
import { UsdTokenName } from '../../sdk/usdToken/usdTokenName'
import { Sdk } from '../../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../config'
import { Amount } from '../../sdk/amount'

export async function runProvideLiquidityTest(
  sourceChain: Network,
  destinationChains: Network[],
  sourceTokenName: UsdTokenName,
  srcAmount: bigint,
  feePercentage?: number,
) {
  const sdk = new Sdk()
  const provider = new JsonRpcProvider(
    await sdk.chains().getRpcUrl(sourceChain),
  )
  const wallet = new Wallet(KHALANI_PRIVATE_KEY_HEX, provider)

  await sdk.wallet().initialize(provider, wallet)
  await sdk.tokens().updateCurrentChainBalances()
  await sdk.tokens().updateRemoteChainBalances()

  const sourceUsdToken = (await sdk
    .tokens()
    .getTokenOnCurrentNetwork(sourceTokenName))!

  const amount = Amount.fromUserUnitsToken(srcAmount, sourceUsdToken)

  console.log('Building provide liquidity intent payload')
  let payload = await sdk
    .intents()
    .buildProvideLiquidityPayload(
      sourceUsdToken.address,
      destinationChains,
      amount,
      feePercentage,
    )
  console.log('Provide liquidity intent payload built', payload)

  console.log('Creating and signing provide liquidity intent')
  const swapIntentResult = await sdk.intents().provideLiquidity(payload)
  console.log('Provide liquidity intent posted to Medusa', swapIntentResult)

  return { sourceUsdToken, amount }
}
