import { ArcadiaSDK } from '../index'
import { ethers, JsonRpcProvider, Wallet } from 'ethers-v6'
import {
  Network,
  IToken,
  RefineResultStatus,
  RpcIntentState,
  FillStructure,
} from '../types'
import { NetworkType } from '../config'
import { FillStructureMap } from '../types/Intent'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const createRefine = async (
  sdk: ArcadiaSDK,
  sourceToken: IToken,
  destinationToken: IToken,
  amount: bigint,
  currentIntentNonce: bigint,
) => {
  const refineService = sdk.refineService

  const refine = await refineService.createRefine({
    accountAddress: sdk.wallet.getUserAddress(),
    fromChainId: Number(sdk.wallet.getNetwork()),
    fromTokenAddress: sourceToken.address,
    amount: amount,
    toChainId: Number(destinationToken.chainId),
    toTokenAddress: destinationToken.address,
    currentNonce: currentIntentNonce,
    fillStructure: FillStructureMap[FillStructure.Exact],
  })

  return refine
}

const queryRefine = async (sdk: ArcadiaSDK, refineId: string) => {
  const refineService = sdk.refineService
  const refine = await refineService.queryRefine(refineId)
  return refine
}

const runBridgeE2E = async (
  sourceNetwork: Network,
  destinationNetwork: Network,
  tokenSymbol: string,
  privateKey: string,
  networkType: NetworkType,
) => {
  // Starting bridge e2e flow
  const sdk = new ArcadiaSDK('EthersV5', networkType)
  const currentNetwork = sourceNetwork
  const currentNetworkDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === currentNetwork,
  )
  const destinationNetworkDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === destinationNetwork,
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

    // Check if the wallet has enough allowance for Permit2
    // console.log('Checking Permit2 allowance...')
    // const permit2Allowance = await sdk.depositService.checkTokenPermit2Approval(
    //   Number(currentNetwork),
    //   sourceToken.address,
    //   wallet.address,
    // )
    // console.log('Permit2 allowance:', permit2Allowance)
    // if (permit2Allowance < spokeAmount) {
    //   console.log(
    //     'Permit2 allowance is less than the amount, approving permit2',
    //   )
    //   // Approve Permit2 for the source token
    //   const approveResult = await sdk.depositService.approveTokenForPermit2(
    //     Number(currentNetwork),
    //     sourceToken.address,
    //   )
    //   console.log('Permit2 approved:', approveResult)
    // }

    // //Sign Permit2 message
    // console.log('Signing Permit2 message...')
    // const permit2Message = await sdk.depositService.signPermit2Message(
    //   Number(currentNetwork),
    //   sourceToken.address,
    //   spokeAmount,
    //   nonce,
    //   deadline,
    // )
    // console.log('Permit2 message:', permit2Message)

    // Check destination token balance before deposit
    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
    ]
    const destinationProvider = new JsonRpcProvider(
      destinationNetworkDetails?.rpcUrls[0],
    )
    const destinationERC20 = new ethers.Contract(
      destinationToken.address,
      erc20Abi,
      destinationProvider,
    )
    const destinationTokenBalanceBefore = await destinationERC20.balanceOf(
      wallet.address,
    )
    console.log(
      `Destination token balance before deposit:`,
      destinationTokenBalanceBefore.toString(),
    )

    // Traditional flow ERC20: ensure allowance
    console.log('Ensuring ERC20 allowance...')
    await sdk.wallet.provider?.send('evm_mine', [])
    await delay(3000)
    await sdk.depositService.ensureERC20Allowance(
      Number(currentNetwork),
      sourceToken.address,
      spokeAmount,
    )

    //Deposit to asset reserves
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
    const createRefineResult = await createRefine(
      sdk,
      sourceToken,
      destinationToken,
      mTokenAmount,
      currentIntentNonce + 1n,
    )
    console.log('Refine created:', createRefineResult)
    console.log('Querying refine...')
    const queryRefineResult = await queryRefine(sdk, createRefineResult)
    console.log('Refine queried:', queryRefineResult)
    if (queryRefineResult === RefineResultStatus.RefinementNotFound) {
      console.log('Refinement not found, leaving the simulation')
      return
    }

    // Sign intent
    console.log('Signing intent...')
    const intentSignature = await sdk.intentService.signIntent(
      queryRefineResult,
    )
    console.log('Intent signed:', intentSignature)

    // Propose intent
    console.log('Creating intent...')
    const proposeIntentResult = await sdk.intentService.proposeIntent({
      refineResult: queryRefineResult,
      signature: intentSignature,
    })
    console.log('Intent proposed:', proposeIntentResult)

    const { intentId } = proposeIntentResult

    // Wait for intent to be executed
    console.log('Waiting for intent to be solved...')
    await sdk.intentService.pollIntentStatus(intentId, RpcIntentState.Solved)
    console.log('Intent solved')

    // Check destination token balance after deposit

    console.log(
      queryRefineResult.Refinement,
      queryRefineResult.Refinement.outcome,
    )

    let balanceCheckPassed = false
    const startTime = Date.now()
    const timeout = 30000
    const pollInterval = 3000

    while (!balanceCheckPassed && Date.now() - startTime < timeout) {
      const currentBalance = await destinationERC20.balanceOf(wallet.address)
      console.log('Current balance:', currentBalance.toString())

      // Convert expected balance from 18 decimals to 6 decimals
      const expectedBalance =
        BigInt(queryRefineResult.Refinement.outcome.mAmounts[0]) /
        BigInt(10 ** 12)
      console.log('Expected balance (6 decimals):', expectedBalance.toString())

      if (currentBalance === destinationTokenBalanceBefore + expectedBalance) {
        balanceCheckPassed = true
        console.log('Destination token balance updated successfully')
      } else {
        console.log('Waiting for balance update...')
        await new Promise((resolve) => setTimeout(resolve, pollInterval))
      }
    }

    if (!balanceCheckPassed) {
      throw new Error('Balance check timed out after 30 seconds')
    }
  } catch (err) {
    console.error('Simulation error:', err)
  }
}

export { runBridgeE2E }
