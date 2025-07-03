import { NetworkType } from "@tvl-labs/arcadia-sdk/config";
import { setCustomConfig } from "@tvl-labs/arcadia-sdk/config";
import { buildDevEnvConfig } from "./config";
import { ArcadiaSDK } from "@tvl-labs/arcadia-sdk";
import { Wallet, JsonRpcProvider, ethers as ethersv6 } from "ethers-v6";
import { ethers } from "ethers";
import { Network, IToken } from '@tvl-labs/arcadia-sdk/types'

const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}

const networkType = NetworkType.devnet;
const spoke1 = "0x7a6a" as Network;
const spoke2 = "0x7a6b" as Network;


/*
HELPER FUNCTIONS
*/

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const buildLpIntentPayload = async (
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
    fillStructure: "PercentageFilled",
    feePercentage: 0.002,
  })

  return payload
}

const createRefinement = async (
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
    fillStructure: "Exact",
  })

  return refine
}

const queryRefinement = async (sdk: ArcadiaSDK, refineId: string) => {
  const refineService = sdk.refineService
  const refine = await refineService.queryRefine(refineId)
  return refine
}

const getAnvilWallets = (count = 10) => {
  const mnemonic = "test test test test test test test test test test test junk";
  const wallets = [];

  for (let i = 0; i < count; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  return wallets;
}

const getTokenBalances = async (userPrivateKey: string, tokenSymbol: string, spoke: Network) => {
  const sdk = new ArcadiaSDK("EthersV5", networkType);
  const spokeDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === spoke,
  )
  if (!spokeDetails) {
    throw new Error(`Network ${spoke} not found in config`)
  }
  const provider = new JsonRpcProvider(spokeDetails.rpcUrls[0])
  const wallet = new Wallet(userPrivateKey, provider)

  sdk.wallet.updateProvider(provider)
  sdk.wallet.updateSigner(wallet)
  sdk.wallet.updateNetworkAndAddress(wallet.address, spoke)

  const spokeToken = sdk.tokensService.getTokenBySymbolAndNetwork(tokenSymbol, spoke)
  const mToken = sdk.tokensService.findArcadiaToken(Number(spoke), spokeToken.address)
  const spokeBalance = await sdk.balanceService.getERC20Balance(spokeToken.address, wallet.address)
  const mTokenBalance = await sdk.balanceService.getMTokenBalance(mToken.address, wallet.address)
  return { spokeBalance: spokeBalance, mTokenBalance: mTokenBalance }
}


/*
Simulations
TODO: move depositing and minting to a separate helper function
*/

const provideLiquidity = async (userPrivateKey: string, tokenSymbol: string, sourceNetwork: Network, destinationNetwork: Network, amount: bigint) => {
  const sdk = new ArcadiaSDK("EthersV5", networkType);
  const currentNetwork = sourceNetwork;
  const currentNetworkDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === currentNetwork,
  )
  if (!currentNetworkDetails) {
    throw new Error(`Network ${currentNetwork} not found in config`)
  }

  const provider = new JsonRpcProvider(currentNetworkDetails.rpcUrls[0])
  const wallet = new Wallet(userPrivateKey, provider)

  sdk.wallet.updateProvider(provider)
  sdk.wallet.updateSigner(wallet)
  sdk.wallet.updateNetworkAndAddress(wallet.address, currentNetwork)

  const sourceToken = sdk.tokensService.getTokenOnCurrentNetwork(tokenSymbol)
  const destinationToken = sdk.tokensService.getTokenBySymbolAndNetwork(
    tokenSymbol,
    destinationNetwork,
  )
  const spokeAmount = amount * 10n ** 6n
  const mTokenAmount = amount * 10n ** 18n

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
  const erc20 = new ethersv6.Contract(sourceToken.address, erc20Abi, wallet)
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
  console.log('Simulating refinement flow...')
  console.log('Creating refinement...')
  const lpIntentPayload = await buildLpIntentPayload(
    sdk,
    sourceToken,
    destinationToken,
    mTokenAmount,
    currentIntentNonce + 1n,
  )
  console.log('Lp intent created:', lpIntentPayload)

  // Sign intent
  console.log('Signing intent...')
  const intentPayload = { Refinement: lpIntentPayload.params[0] }
  const intentSignature = await sdk.intentService.signIntent(intentPayload)
  console.log('Intent signed:', intentSignature)

  // Propose intent
  console.log('Posting intent...')
  const proposeIntentResult = await sdk.intentService.proposeIntent({
    refineResult: intentPayload,
    signature: intentSignature,
  })
  console.log('Intent posted:', proposeIntentResult)

  const { intentId } = proposeIntentResult
  return intentId;
}

const bridge = async (userPrivateKey: string, tokenSymbol: string, sourceNetwork: Network, destinationNetwork: Network, amount: bigint) => {
  const sdk = new ArcadiaSDK("EthersV5", networkType);
  const currentNetwork = sourceNetwork;
  const currentNetworkDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === currentNetwork,
  )
  const destinationNetworkDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === destinationNetwork,
  )
  if (!currentNetworkDetails) {
    throw new Error(`Network ${currentNetwork} not found in config`)
  }
  if (!destinationNetworkDetails) {
    throw new Error(`Network ${destinationNetwork} not found in config`)
  }

  const provider = new JsonRpcProvider(currentNetworkDetails.rpcUrls[0])
  const wallet = new Wallet(userPrivateKey, provider)

  sdk.wallet.updateProvider(provider)
  sdk.wallet.updateSigner(wallet)
  sdk.wallet.updateNetworkAndAddress(wallet.address, currentNetwork)

  const sourceToken = sdk.tokensService.getTokenOnCurrentNetwork(tokenSymbol)
  const destinationToken = sdk.tokensService.getTokenBySymbolAndNetwork(
    tokenSymbol,
    destinationNetwork,
  )
  const spokeAmount = amount * 10n ** 6n
  const mTokenAmount = amount * 10n ** 18n
  const erc20Abi = [
    'function balanceOf(address owner) view returns (uint256)',
  ]
  const destinationProvider = new JsonRpcProvider(
    destinationNetworkDetails?.rpcUrls[0],
  )
  const destinationERC20 = new ethersv6.Contract(
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
  const createRefineResult = await createRefinement(
    sdk,
    sourceToken,
    destinationToken,
    mTokenAmount,
    currentIntentNonce + 1n,
  )
  console.log('Refine created:', createRefineResult)
  console.log('Querying refine...')
  const queryRefineResult = await queryRefinement(sdk, createRefineResult)
  console.log('Refine queried:', queryRefineResult)
  if (queryRefineResult === "RefinementNotFound") {
    console.log('Refinement not found, leaving the simulation')
    return
  }

  const bridgeAmount = BigInt(queryRefineResult.Refinement.outcome.mAmounts[0])

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

  return { intentId: intentId, bridgeAmount: bridgeAmount }
}

const cancelIntent = async (userPrivateKey: string, intentId: string) => {
  const sdk = new ArcadiaSDK("EthersV5", networkType);
  const provider = sdk.wallet.getArcadiaProvider();
  const wallet = new Wallet(userPrivateKey, provider)
  sdk.wallet.updateProvider(provider)
  sdk.wallet.updateSigner(wallet)

  await sdk.intentService.cancelIntent(intentId)
}

const withdrawMTokens = async (userPrivateKey: string, tokenSymbol: string, spoke: Network, amount: bigint) => {
  const sdk = new ArcadiaSDK("EthersV5", networkType);
  const spokeDetails = sdk.config.supportedChains.find(
    (chain) => chain.chainId === spoke,
  )
  if (!spokeDetails) {
    throw new Error(`Network ${spoke} not found in config`)
  }
  const provider = new JsonRpcProvider(spokeDetails.rpcUrls[0])
  const wallet = new Wallet(userPrivateKey, provider)

  sdk.wallet.updateProvider(provider)
  sdk.wallet.updateSigner(wallet)
  sdk.wallet.updateNetworkAndAddress(wallet.address, spoke)

  const spokeToken = sdk.tokensService.getTokenBySymbolAndNetwork(tokenSymbol, spoke)
  const mToken = sdk.tokensService.findArcadiaToken(Number(spoke), spokeToken.address)

  await sdk.withdrawService.withdrawMtokens(mToken.address, wallet.address, amount)
}

/*
TESTS
*/

const testCancelLiquidity = async () => {
  try {
    console.log("Starting cancel liquidity test: creating one LP and cancelling it")
    const privateKey = getAnvilWallets()[0].privateKey
    const { spokeBalance: spokeBalanceBefore, mTokenBalance: mTokenBalanceBefore } = await getTokenBalances(privateKey, "USDC", spoke1);
    const intentId = await provideLiquidity(privateKey, "USDC", spoke1, spoke2, 1n)
    if (!intentId) {
      throw new Error("Intent ID is undefined")
    }
    console.log('Cancelling intent with ID:', intentId)
    await cancelIntent(privateKey, intentId)
    await delay(10000)
    const { spokeBalance, mTokenBalance } = await getTokenBalances(privateKey, "USDC", spoke1)
    console.assert(spokeBalanceBefore - spokeBalance === 1n * 10n ** 6n, "Simulation error: spoke balance is not equal to 1 USDC")
    console.assert(mTokenBalance - mTokenBalanceBefore === 1n * 10n ** 18n, "Simulation error: mToken balance is not equal to 1 USDC")
    console.log("Test passed: token balances updated correctly")
  } catch (err) {
    console.error('Simulation error:', err)
  }
}

const testSequentialBridge = async (numWallets: number = 3) => {
  try {
    console.log(`Starting multi-bridge test: Creating one LP and bridge against it ${numWallets} times`)
    const wallets = getAnvilWallets(numWallets + 2)
    const lpKey = wallets[1].privateKey
    await provideLiquidity(lpKey, "USDC", spoke1, spoke2, 10n)
    for (let i = 2; i < numWallets + 2; i++) {
      const key = wallets[i].privateKey
      const { spokeBalance: spokeBalanceBefore } = await getTokenBalances(key, "USDC", spoke1);
      console.log('spoke balance before:', spokeBalanceBefore.toString())
      const result = await bridge(key, "USDC", spoke2, spoke1, 1n)
      if (!result) {
        throw new Error("Result is undefined")
      }
      await delay(10000)
      const { intentId, bridgeAmount } = result
      console.log('Intent ID:', intentId)
      console.log('Bridge amount:', bridgeAmount.toString())
      const { spokeBalance } = await getTokenBalances(key, "USDC", spoke1)
      console.log('spoke balance after:', spokeBalance.toString())
      const deltaSpokeBalance = spokeBalance - spokeBalanceBefore
      console.assert(deltaSpokeBalance === bridgeAmount / 10n ** 12n, "Simulation error: delta spoke balance is not equal to bridge amount")
      // TODO: implement the getHistory function in sdk and track down the output intents
      console.log("Test passed: token balances updated correctly")
    }
  } catch (err) {
    console.error('Simulation error:', err)
  }
}

const testDepositAndWithdrawTokens = async () => {
  try {
    console.log("Starting deposit and withdraw tokens test")
    const userPrivateKey = getAnvilWallets()[0].privateKey
    const tokenSymbol = "USDC"
    const sourceNetwork = spoke1
    const amount = 1n
    const sdk = new ArcadiaSDK("EthersV5", networkType);
    const currentNetwork = sourceNetwork;
    const currentNetworkDetails = sdk.config.supportedChains.find(
      (chain) => chain.chainId === currentNetwork,
    )
    if (!currentNetworkDetails) {
      throw new Error(`Network ${currentNetwork} not found in config`)
    }

    const provider = new JsonRpcProvider(currentNetworkDetails.rpcUrls[0])
    const wallet = new Wallet(userPrivateKey, provider)

    sdk.wallet.updateProvider(provider)
    sdk.wallet.updateSigner(wallet)
    sdk.wallet.updateNetworkAndAddress(wallet.address, currentNetwork)

    const sourceToken = sdk.tokensService.getTokenOnCurrentNetwork(tokenSymbol)
    const spokeAmount = amount * 10n ** 6n
    const mTokenAmount = amount * 10n ** 18n

    const { spokeBalance: spokeBalanceBeforeDeposit, mTokenBalance: mTokenBalanceBeforeDeposit } = await getTokenBalances(userPrivateKey, tokenSymbol, sourceNetwork);
    console.log('Spoke balance before deposit:', spokeBalanceBeforeDeposit.toString())
    console.log('MToken balance before deposit:', mTokenBalanceBeforeDeposit.toString())

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
    const erc20 = new ethersv6.Contract(sourceToken.address, erc20Abi, wallet)
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
    const mintedTokens = await sdk.balanceService.waitForMinting(
      { address: sourceToken.address, chainId: currentNetwork },
      mTokenAmount,
      wallet.address,
    )
    console.log('Minted tokens:', mintedTokens)

    const { spokeBalance: spokeBalanceBeforeWithdrawal, mTokenBalance: mTokenBalanceBeforeWithdrawal } = await getTokenBalances(userPrivateKey, tokenSymbol, sourceNetwork);
    console.log('Spoke balance before withdrawal:', spokeBalanceBeforeWithdrawal.toString())
    console.log('MToken balance before withdrawal:', mTokenBalanceBeforeWithdrawal.toString())
    await withdrawMTokens(userPrivateKey, tokenSymbol, sourceNetwork, amount * 10n ** 18n)
    await delay(10000)
    const { spokeBalance: spokeBalanceAfterWithdrawal, mTokenBalance: mTokenBalanceAfterWithdrawal } = await getTokenBalances(userPrivateKey, tokenSymbol, sourceNetwork);
    console.log('Spoke balance after withdrawal:', spokeBalanceAfterWithdrawal.toString())
    console.log('MToken balance after withdrawal:', mTokenBalanceAfterWithdrawal.toString())
    console.assert(spokeBalanceBeforeDeposit === spokeBalanceAfterWithdrawal, "Simulation error: spoke balance after withdrawal is not equal to spoke balance before depositing")
    console.assert(mTokenBalanceBeforeDeposit === mTokenBalanceAfterWithdrawal, "Simulation error: mToken balance after withdrawal is not equal to mToken balance before depositing")
    console.log("Test passed: token balances updated correctly")

  } catch (err) {
    console.error('Simulation error:', err)
  }
}

const testConcurrentBridge = async (numWallets: number = 3) => {
  throw new Error("Not implemented")
}

const simulationTests = async () => {
  const devEnvConfig = await buildDevEnvConfig();
  setCustomConfig(devEnvConfig);
  console.log("Starting simulation tests")
  console.log("\n--------------------------------\n")
  await testDepositAndWithdrawTokens()
  console.log("\n--------------------------------\n")
  await testSequentialBridge(3)
  console.log("\n--------------------------------\n")
  await testCancelLiquidity()
  console.log("🥳 Simulation tests completed")
}

await simulationTests()