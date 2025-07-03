import { ArcadiaSDK } from '../index'
import { ethers, JsonRpcProvider, Wallet } from 'ethers-v6'
import { Network, IToken, RpcIntentState, FillStructure } from '../types'
import { NetworkType } from '../config'
import { FillStructureMap } from '../types/Intent'

const buildIntentPayload = async (
  sdk: ArcadiaSDK,
  sourceToken: IToken,
  destinationToken: IToken,
  amount: bigint,
  currentIntentNonce: bigint,
) => {
  const refineService = sdk.refineService

  const payload = refineService.buildCreateRefinePayload({
    accountAddress: sdk.wallet.getUserAddress(),
    fromChainId: Number(sdk.wallet.getNetwork()),
    fromTokenAddress: sourceToken.address,
    amount: amount,
    toChainId: Number(destinationToken.chainId),
    toTokenAddress: destinationToken.address,
    currentNonce: currentIntentNonce,
    fillStructure: FillStructureMap[FillStructure.PercentageFilled],
    feePercentage: 0.002,
  })

  return payload
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const runLiquidityE2E = async (
  sourceNetwork: Network,
  destinationNetwork: Network,
  tokenSymbol: string,
  privateKey: string,
  networkType: NetworkType,
) => {
  // Starting liquidity e2e flow
  const sdk = new ArcadiaSDK('EthersV5', networkType)
  const currentNetwork = sourceNetwork
  const currentNetworkDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === currentNetwork,
  )

  if (!currentNetworkDetails) {
    throw new Error(`Network ${currentNetwork} not found in config`)
  }

  // Create Provider and Wallet
  const provider = new JsonRpcProvider(currentNetworkDetails.rpcUrls[0])
  const wallet = new Wallet(privateKey, provider)

  // Update the WalletService
  sdk.wallet.updateProvider(provider)
  sdk.wallet.updateSigner(wallet)
  sdk.wallet.updateNetworkAndAddress(wallet.address, currentNetwork)

  // Now sdk.* services should be ready to go
  // Simulate the entire flow:

  const sourceToken = sdk.tokensService.getTokenOnCurrentNetwork(tokenSymbol)
  const destinationToken = sdk.tokensService.getTokenBySymbolAndNetwork(
    tokenSymbol,
    destinationNetwork,
  )
  const spokeAmount = 10n * 10n ** 6n
  const mTokenAmount = 10n * 10n ** 18n
  const nonce = BigInt(Math.floor(Date.now() / 1000))
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 10 * 60)

  try {
    const walletState = sdk.wallet.getWalletData()
    console.log('Wallet state:', walletState)

    // Traditional flow ERC20: ensure allowance
    console.log('Ensuring ERC20 allowance...')
    await sdk.wallet.provider?.send('evm_mine', [])
    await delay(3000)

    // Ensure ERC20 allowance with proper async handling
    await sdk.depositService.ensureERC20Allowance(
      Number(currentNetwork),
      sourceToken.address,
      spokeAmount,
    )

    // Check source token balance before deposit
    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
    ]
    const erc20 = new ethers.Contract(sourceToken.address, erc20Abi, wallet)
    const balance = await erc20.balanceOf(wallet.address)
    console.log(`Source token balance before deposit:`, balance.toString())

    // Deposit to asset reserves
    console.log('Depositing to asset reserves...')
    await sdk.wallet.provider?.send('evm_mine', [])
    await delay(3000)
    await sdk.depositService.depositTraditional(
      sourceToken.address,
      spokeAmount,
    )
    console.log('Deposited to asset reserves')

    // Wait for mTokens to be minted
    console.log('Waiting for mTokens to be minted...')
    console.log('hmmm')
    const mintedTokens = await sdk.balanceService.waitForMinting(
      { address: sourceToken.address, chainId: currentNetwork },
      mTokenAmount,
      wallet.address,
    )
    console.log('Minted tokens:', mintedTokens)

    // Get current user intent nonce
    console.log('Getting current user intent nonce...')
    const currentIntentNonce = await sdk.intentService.getIntentNonce(
      wallet.address,
    )
    console.log('Current intent nonce:', currentIntentNonce)

    // Simulate the refine flow:
    console.log('Simulating refine flow...')
    console.log('Creating refine...')
    const createRefineResult = await buildIntentPayload(
      sdk,
      sourceToken,
      destinationToken,
      mTokenAmount,
      currentIntentNonce + 1n,
    )
    console.log('Refine created:', createRefineResult)

    // Sign intent
    console.log('Signing intent...')
    const intentPayload = { Refinement: createRefineResult.params[0] }
    const intentSignature = await sdk.intentService.signIntent(intentPayload)
    console.log('Intent signed:', intentSignature)

    // Propose intent
    console.log('Creating intent...')
    const proposeIntentResult = await sdk.intentService.proposeIntent({
      refineResult: intentPayload,
      signature: intentSignature,
    })
    console.log('Intent proposed:', proposeIntentResult)

    const { intentId } = proposeIntentResult

    // Wait for intent to be executed
    console.log('Waiting for intent to be solved...')
    await sdk.intentService.pollIntentStatus(intentId, RpcIntentState.Open)
    console.log('Intent solved')
  } catch (err) {
    console.error('Simulation error:', err)
  }
}

export { runLiquidityE2E }
