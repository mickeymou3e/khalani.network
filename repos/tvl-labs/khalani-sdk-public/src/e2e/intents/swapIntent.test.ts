import { Network } from '@constants/Networks'
import { UsdTokenName } from '../../sdk/usdToken/usdTokenName'
import { Sdk } from '../../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../config'
import { Amount } from '../../sdk/amount'
import { QueryRefineErrors } from '@store/refine'
import { Intent } from '@store/swaps'

export async function runSwapIntentTest(
  sourceChain: Network,
  destinationChain: Network,
  sourceTokenName: UsdTokenName,
  destinationTokenName: UsdTokenName,
  srcAmount: bigint,
  slippage?: number,
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

  const destinationUsdToken = (await sdk
    .tokens()
    .getTokenOnNetwork(destinationTokenName, destinationChain))!
  const amount = Amount.fromUserUnitsToken(srcAmount, sourceUsdToken)

  console.log('Building swap intent payload')
  let refinePayload = await sdk
    .intents()
    .buildSwapIntentPayload(
      sourceUsdToken.address,
      destinationUsdToken.address,
      parseInt(destinationChain, 16),
      amount,
      sourceChain,
      slippage,
    )
  console.log('Refine payload built', refinePayload)

  const intentId = await sdk.intents().createRefine(refinePayload)
  console.log('Intent ID after refinement creation:', intentId)

  let proposedIntent = null

  console.log('Waiting for the proposed swap intent...')
  while (!proposedIntent) {
    console.log(`Querying for proposed intent...`)
    proposedIntent = await sdk.intents().queryRefine(intentId)

    if (
      typeof proposedIntent === 'string' &&
      Object.values(QueryRefineErrors).includes(
        proposedIntent as QueryRefineErrors,
      )
    ) {
      console.log('Received a refine error:', proposedIntent)
      return proposedIntent as QueryRefineErrors
    }

    if (proposedIntent) {
      console.log('Proposed swap intent by Medusa:', proposedIntent)
    } else {
      console.log('Proposed intent is still null, retrying in 3 seconds...')
      // Wait for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }
  console.log('Proposed swap intent by Medusa:', proposedIntent)

  if (typeof proposedIntent === 'string') return
  console.log('Creating and signing swap intent')
  const swapIntentPayload = {
    ...proposedIntent,
    destChain: parseInt(destinationChain),
  }
  const swapIntentResult = await sdk.intents().swapIntent(swapIntentPayload)
  console.log('Swap intent posted to Medusa', swapIntentResult)

  return { sourceUsdToken, amount }
}
