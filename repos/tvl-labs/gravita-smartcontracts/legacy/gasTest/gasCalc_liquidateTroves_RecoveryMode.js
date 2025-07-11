/* Script that logs gas costs for Liquity operations under various conditions. 

  Note: uses Mocha testing structure, but the purpose of each test is simply to print gas costs.

  'asserts' are only used to confirm the setup conditions.
*/
const fs = require('fs')

const deploymentHelper = require("../utils/deploymentHelpers.js")
const testHelpers = require("../utils/testHelpers.js")

const th = testHelpers.TestHelper
const dec = th.dec
const timeValues = testHelpers.TimeValues
const _100pct = th._100pct

const ZERO_ADDRESS = th.ZERO_ADDRESS

contract('Gas cost tests', async accounts => {
  const [owner] = accounts;
  const bountyAddress = accounts[998]
  const lpRewardsAddress = accounts[999]
  const multisig = accounts[1000]

  let priceFeed
  let VUSDToken

  let sortedVessels
  let vesselManager
  let activePool
  let stabilityPool
  let defaultPool
  let borrowerOperations

  let contracts
  let data = []

  beforeEach(async () => {
    contracts = await deploymentHelper.deployLiquityCore()
    const SPRContracts = await deploymentHelper.deploySPRContractsHardhat(accounts[0])

    priceFeed = contracts.priceFeedTestnet
    VUSDToken = contracts.vusdToken
    sortedVessels = contracts.sortedVessels
    vesselManager = contracts.vesselManager
    activePool = contracts.activePool
    stabilityPool = contracts.stabilityPool
    defaultPool = contracts.defaultPool
    borrowerOperations = contracts.borrowerOperations
    hintHelpers = contracts.hintHelpers

    SPRStaking = SPRContracts.SPRStaking
    SPRToken = SPRContracts.SPRToken
    communityIssuance = SPRContracts.communityIssuance

    await deploymentHelper.connectCoreContracts(contracts, SPRContracts)
    await deploymentHelper.connectSPRContractsToCore(SPRContracts, contracts)
  })

  // --- liquidateVessels RECOVERY MODE - pure redistribution ---

  // 1 vessel
  it("", async () => {
    const message = 'liquidateVessels(). n = 1. Pure redistribution, Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //1 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _1_Defaulter = accounts.slice(1, 2)
    await th.openVessel_allAccounts(_1_Defaulter, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _1_Defaulter) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))
    const price = await priceFeed.getPrice()

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(1, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _1_Defaulter) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 2 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 2. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //2 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _2_Defaulters = accounts.slice(1, 3)
    await th.openVessel_allAccounts(_2_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _2_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(2, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _2_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 3 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 3. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //3 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _3_Defaulters = accounts.slice(1, 4)
    await th.openVessel_allAccounts(_3_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _3_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(3, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _3_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 5 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 5. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //5 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _5_Defaulters = accounts.slice(1, 6)
    await th.openVessel_allAccounts(_5_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _5_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(5, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _5_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 10 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 10. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //10 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _10_Defaulters = accounts.slice(1, 11)
    await th.openVessel_allAccounts(_10_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _10_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(10, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _10_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  //20 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 20. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 90 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //20 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _20_Defaulters = accounts.slice(1, 21)
    await th.openVessel_allAccounts(_20_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _20_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(20, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _20_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 30 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 30. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 90 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //30 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _30_Defaulters = accounts.slice(1, 31)
    await th.openVessel_allAccounts(_30_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _30_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(30, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _30_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 40 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 40. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 90 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //40 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _40_Defaulters = accounts.slice(1, 41)
    await th.openVessel_allAccounts(_40_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _40_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 100 VUSD
    await borrowerOperations.openVessel(_100pct, dec(60, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(40, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulters' vessels have been closed
    for (account of _40_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 45 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 45. Pure redistribution. Recovery Mode'
    // 10 accts each open Vessel 
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(1000, 'ether'), dec(90000, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //45 accts open Vessel
    const _45_Defaulters = accounts.slice(1, 46)
    await th.openVessel_allAccounts(_45_Defaulters, contracts, dec(100, 'ether'), dec(9500, 18))

    // Check all defaulters are active
    for (account of _45_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens Vessel
    await borrowerOperations.openVessel(_100pct, dec(9500, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Price drops, defaulters' vessels fall below MCR
    await priceFeed.setPrice(dec(100, 18))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    const tx = await vesselManager.liquidateVessels(45, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check defaulters' vessels have been closed
    for (account of _45_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // --- liquidate Vessels --- RECOVERY MODE --- Full offset, NO pending distribution rewards ----

  // 1 vessel
  it("", async () => {
    const message = 'liquidateVessels(). n = 1. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //1 acct opens Vessel with 1 ether and withdraw 100 VUSD
    const _1_Defaulter = accounts.slice(1, 2)
    await th.openVessel_allAccounts(_1_Defaulter, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _1_Defaulter) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _1_Defaulter) {
      console.log(`ICR: ${await vesselManager.getCurrentICR(account, price)}`)
      assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price))
    }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(1, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _1_Defaulter) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 2 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 2. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //2 acct opens Vessel with 1 ether and withdraw 100 VUSD
    const _2_Defaulters = accounts.slice(1, 3)
    await th.openVessel_allAccounts(_2_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _2_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _2_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(2, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _2_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })


  // 3 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 3. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //3 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _3_Defaulters = accounts.slice(1, 4)
    await th.openVessel_allAccounts(_3_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _3_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _3_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(3, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _3_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 5 vessels 
  it("", async () => {
    const message = 'liquidateVessels(). n = 5. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //5 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _5_Defaulters = accounts.slice(1, 6)
    await th.openVessel_allAccounts(_5_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _5_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _5_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(5, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _5_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })


  // 10 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 10. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //10 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _10_Defaulters = accounts.slice(1, 11)
    await th.openVessel_allAccounts(_10_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _10_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _10_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(10, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _10_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 20 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 20. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //30 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _20_Defaulters = accounts.slice(1, 21)
    await th.openVessel_allAccounts(_20_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _20_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _20_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(20, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _20_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })


  // 30 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 30. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //30 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _30_Defaulters = accounts.slice(1, 31)
    await th.openVessel_allAccounts(_30_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _30_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _30_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(30, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _30_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 40 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 40. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //40 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _40_Defaulters = accounts.slice(1, 41)
    await th.openVessel_allAccounts(_40_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _40_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _40_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(40, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _40_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 45 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 45. All fully offset with Stability Pool. No pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(1000, 'ether'), dec(90000, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    //45 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _45_Defaulters = accounts.slice(1, 46)
    await th.openVessel_allAccounts(_45_Defaulters, contracts, dec(100, 'ether'), dec(9500, 18))

    // Check all defaulters are active
    for (account of _45_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(100, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _45_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(45, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _45_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // --- liquidate Vessels --- RECOVERY MODE --- Full offset, HAS pending distribution rewards ----

  // 1 vessel
  it("", async () => {
    const message = 'liquidateVessels(). n = 1. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //1 acct opens Vessel with 1 ether and withdraw 100 VUSD
    const _1_Defaulter = accounts.slice(1, 2)
    await th.openVessel_allAccounts(_1_Defaulter, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _1_Defaulter) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _1_Defaulter) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _1_Defaulter) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(1, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // // Check Vessels are closed
    for (account of _1_Defaulter) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 2 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 2. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //2 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _2_Defaulters = accounts.slice(1, 3)
    await th.openVessel_allAccounts(_2_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _2_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _2_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _2_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(2, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _2_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))


    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 3 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 3. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //3 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _3_Defaulters = accounts.slice(1, 4)
    await th.openVessel_allAccounts(_3_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _3_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _3_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _3_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(3, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _3_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 5 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 5. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //5 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _5_Defaulters = accounts.slice(1, 6)
    await th.openVessel_allAccounts(_5_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _5_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _5_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _5_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(5, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _5_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 10 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 10. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //10 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _10_Defaulters = accounts.slice(1, 11)
    await th.openVessel_allAccounts(_10_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _10_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _10_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _10_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(10, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _10_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 20 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 20. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //20 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _20_Defaulters = accounts.slice(1, 21)
    await th.openVessel_allAccounts(_20_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _20_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _20_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _20_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(20, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _20_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 30 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 30. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //30 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _30_Defaulters = accounts.slice(1, 31)
    await th.openVessel_allAccounts(_30_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _30_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _30_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _30_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(30, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _30_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 40 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 40. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel with 10 ether, withdraw 900 VUSD
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(10, 'ether'), dec(900, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //40 accts open Vessel with 1 ether and withdraw 100 VUSD
    const _40_Defaulters = accounts.slice(1, 41)
    await th.openVessel_allAccounts(_40_Defaulters, contracts, dec(1, 'ether'), dec(60, 18))

    // Check all defaulters are active
    for (account of _40_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens with 1 ether and withdraws 110 VUSD
    await borrowerOperations.openVessel(_100pct, dec(110, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(1, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _40_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(120, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _40_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(40, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _40_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 45 vessels
  it("", async () => {
    const message = 'liquidateVessels(). n = 45. All fully offset with Stability Pool. Has pending distribution rewards. In Recovery Mode'
    // 10 accts each open Vessel
    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(1000, 'ether'), dec(90000, 18))
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }

    //45 accts opens
    const _45_Defaulters = accounts.slice(1, 46)
    await th.openVessel_allAccounts(_45_Defaulters, contracts, dec(100, 'ether'), dec(9500, 18))

    // Check all defaulters are active
    for (account of _45_Defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 opens
    await borrowerOperations.openVessel(_100pct, dec(11000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })
    assert.isTrue(await sortedVessels.contains(accounts[500]))

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    assert.isFalse(await sortedVessels.contains(accounts[500]))
    await priceFeed.setPrice(dec(200, 18))

    // Check all defaulters have pending rewards 
    for (account of _45_Defaulters) { assert.isTrue(await vesselManager.hasPendingRewards(account)) }

    // Whale opens vessel and fills SP with 1 billion VUSD
    const whale = accounts[999]
    await borrowerOperations.openVessel(_100pct, dec(9, 28), whale, ZERO_ADDRESS, { from: whale, value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(9, 28), ZERO_ADDRESS, { from: whale })

    // Check SP has 9e28 VUSD
    const USDVinSP = (await stabilityPool.getTotalVUSDDeposits()).toString()
    assert.equal(USDVinSP, dec(9, 28))

    // Price drops, defaulters falls below MCR
    await priceFeed.setPrice(dec(100, 18))
    const price = await priceFeed.getPrice()

    // Check Recovery Mode is true
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check defaulter ICRs are all between 100% and 110%
    for (account of _45_Defaulters) { assert.isTrue(await th.ICRbetween100and110(account, vesselManager, price)) }

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    // Liquidate vessels
    const tx = await vesselManager.liquidateVessels(45, { from: accounts[0] })
    assert.isTrue(tx.receipt.status)

    // Check Recovery Mode is true after liquidations
    assert.isTrue(await vesselManager.checkRecoveryMode(await priceFeed.getPrice()))

    // Check Vessels are closed
    for (account of _45_Defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    // Check initial vessels with starting 10E/90USDV, and whale's vessel, are still open
    for (account of accounts.slice(101, 111)) { assert.isTrue(await sortedVessels.contains(account)) }
    assert.isTrue(await sortedVessels.contains(whale))

    //Check VUSD in SP has decreased but is still > 0
    const USDVinSP_After = await stabilityPool.getTotalVUSDDeposits()
    assert.isTrue(USDVinSP_After.lt(web3.utils.toBN(dec(9, 28))))
    assert.isTrue(USDVinSP_After.gt(web3.utils.toBN('0')))

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // --- BatchLiquidateVessels ---

  // --- Pure redistribution, no offset. WITH pending distribution rewards ---

  // 10 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 10. Pure redistribution. Has pending distribution rewards.'
    // 10 accts each open Vessel with 10 ether, withdraws VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(1000, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })

    const _10_defaulters = accounts.slice(1, 11)
    // --- Accounts to be liquidated in the test tx ---
    await th.openVessel_allAccounts(_10_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // Check all defaulters active
    for (account of _10_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    const tx = await vesselManager.batchLiquidateVessels(_10_defaulters, { from: accounts[0] })

    // Check all defaulters liquidated
    for (account of _10_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 40 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 40. Pure redistribution. Has pending distribution rewards.'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(100, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })


    // --- Accounts to be liquidated in the test tx ---
    const _40_defaulters = accounts.slice(1, 41)
    await th.openVessel_allAccounts(_40_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // Check all defaulters active
    for (account of _40_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    const tx = await vesselManager.batchLiquidateVessels(_40_defaulters, { from: accounts[0] })

    // check all defaulters liquidated
    for (account of _40_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 45 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 45. Pure redistribution. Has pending distribution rewards.'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(1000, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })

    // --- Accounts to be liquidated in the test tx ---
    const _45_defaulters = accounts.slice(1, 46)
    await th.openVessel_allAccounts(_45_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // check all defaulters active
    for (account of _45_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    const tx = await vesselManager.batchLiquidateVessels(_45_defaulters, { from: accounts[0] })

    // check all defaulters liquidated
    for (account of _45_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })


  // 50 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 50. Pure redistribution. Has pending distribution rewards.'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(100, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })

    // --- Accounts to be liquidated in the test tx ---
    const _50_defaulters = accounts.slice(1, 51)
    await th.openVessel_allAccounts(_50_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // check all defaulters active
    for (account of _50_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    const tx = await vesselManager.batchLiquidateVessels(_50_defaulters, { from: accounts[0] })

    // check all defaulters liquidated
    for (account of _50_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })


  // --- batchLiquidateVessels - pure offset with Stability Pool ---

  // 10 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 10. All vessels fully offset. Have pending distribution rewards'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(1000, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })

    const _10_defaulters = accounts.slice(1, 11)
    // --- Accounts to be liquidated in the test tx ---
    await th.openVessel_allAccounts(_10_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // Check all defaulters active
    for (account of _10_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Whale opens vessel and fills SP with 1 billion VUSD
    await borrowerOperations.openVessel(_100pct, dec(1, 27), accounts[999], ZERO_ADDRESS, { from: accounts[999], value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(1, 27), ZERO_ADDRESS, { from: accounts[999] })

    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    const tx = await vesselManager.batchLiquidateVessels(_10_defaulters, { from: accounts[0] })

    // Check all defaulters liquidated
    for (account of _10_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })


  // 40 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 40. All vessels fully offset. Have pending distribution rewards'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(100, 'ether'), dec(10000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })


    // --- Accounts to be liquidated in the test tx ---
    const _40_defaulters = accounts.slice(1, 41)
    await th.openVessel_allAccounts(_40_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // Check all defaulters active
    for (account of _40_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Whale opens vessel and fills SP with 1 billion VUSD
    await borrowerOperations.openVessel(_100pct, dec(1, 27), accounts[999], ZERO_ADDRESS, { from: accounts[999], value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(1, 27), ZERO_ADDRESS, { from: accounts[999] })


    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    const tx = await vesselManager.batchLiquidateVessels(_40_defaulters, { from: accounts[0] })

    // check all defaulters liquidated
    for (account of _40_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 45 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 45. All vessels fully offset. Have pending distribution rewards'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(100, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })

    // --- Accounts to be liquidated in the test tx ---
    const _45_defaulters = accounts.slice(1, 46)
    await th.openVessel_allAccounts(_45_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // check all defaulters active
    for (account of _45_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Whale opens vessel and fills SP with 1 billion VUSD
    await borrowerOperations.openVessel(_100pct, dec(1, 27), accounts[999], ZERO_ADDRESS, { from: accounts[999], value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(1, 27), ZERO_ADDRESS, { from: accounts[999] })


    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    const tx = await vesselManager.batchLiquidateVessels(_45_defaulters, { from: accounts[0] })

    // check all defaulters liquidated
    for (account of _45_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  // 50 vessels
  it("", async () => {
    const message = 'batchLiquidateVessels(). n = 50. All vessels fully offset. Have pending distribution rewards'
    // 10 accts each open Vessel with 10 ether, withdraw 180 VUSD

    await th.openVessel_allAccounts(accounts.slice(101, 111), contracts, dec(100, 'ether'), dec(13000, 18))

    // Account 500 opens with 1 ether and withdraws 180 VUSD
    await borrowerOperations.openVessel(_100pct, dec(13000, 18), accounts[500], ZERO_ADDRESS, { from: accounts[500], value: dec(100, 'ether') })

    // --- Accounts to be liquidated in the test tx ---
    const _50_defaulters = accounts.slice(1, 51)
    await th.openVessel_allAccounts(_50_defaulters, contracts, dec(100, 'ether'), dec(13000, 18))

    // check all defaulters active
    for (account of _50_defaulters) { assert.isTrue(await sortedVessels.contains(account)) }

    // Account 500 is liquidated, creates pending distribution rewards for all
    await priceFeed.setPrice(dec(100, 18))
    await vesselManager.liquidate(accounts[500], { from: accounts[0] })
    await priceFeed.setPrice(dec(200, 18))

    // Whale opens vessel and fills SP with 1 billion VUSD
    await borrowerOperations.openVessel(_100pct, dec(1, 27), accounts[999], ZERO_ADDRESS, { from: accounts[999], value: dec(1, 27) })
    await stabilityPool.provideToSP(dec(1, 27), ZERO_ADDRESS, { from: accounts[999] })


    // Price drops, account[1]'s ICR falls below MCR
    await priceFeed.setPrice(dec(100, 18))

    await th.fastForwardTime(timeValues.SECONDS_IN_ONE_HOUR, web3.currentProvider)

    const tx = await vesselManager.batchLiquidateVessels(_50_defaulters, { from: accounts[0] })

    // check all defaulters liquidated
    for (account of _50_defaulters) { assert.isFalse(await sortedVessels.contains(account)) }

    const gas = th.gasUsed(tx)
    th.logGas(gas, message)

    th.appendData({ gas: gas }, message, data)
  })

  it("Export test data", async () => {
    fs.writeFile('gasTest/outputs/liquidateVesselsGasData.csv', data, (err) => {
      if (err) { console.log(err) } else {
        console.log("LiquidateVessels() gas test data written to gasTest/outputs/liquidateVesselsGasData.csv")
      }
    })
  })
})
