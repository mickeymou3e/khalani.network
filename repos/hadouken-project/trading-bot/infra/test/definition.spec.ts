import * as stepFn from 'aws-sdk/clients/stepfunctions'
import { readStateMachineDefinition, StateMachineHelper } from './helper'

const stepFunctions = new stepFn({
  endpoint: 'http://step-functions:8083',
  accessKeyId: 'AKIAXTTRUF7NU7KDMIED',
  secretAccessKey: 'S88RXnp5BHLsysrsiaHwbOnW2wd9EAxmo4sGWhab',
  region: 'local',
})
const helper = new StateMachineHelper(stepFunctions)
const dummyArn = 'arn:aws:lambda:::function:ArbitrageStateFunctionHandler'
const arbitrageMachineName = 'ArbitrageBotStateMachine'
const linearMachineName = 'LinearBotStateMachine'
const binanceMachineName = 'BinanceBotStateMachine'
const liquidationMachineName = 'LiquidationBotStateMachine'

const txReceipt = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    hash: '0x003d91e1f545e065dffe5aab7fea803af99204f1be55f16b39bd2d9c9e6a7973',
    blockHash:
      '0x7b4bfe0eab119fae9bff0f9ce3c300713abc10b9bb9cfc6d646598d36c007928',
    blockNumber: '0x593a6',
    transactionIndex: '0x2',
    from: '0xa14d06ee65f19ea64548ca2effcc26925823827d',
    to: '0x657cc11c7a06d9d2f7eef5e5af5f23c69d05077e',
    gas: '0xd2c65',
    gasPrice: '0x246139ca8000',
    input:
      '0x34f3c2b70000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000007538c85cae4e4673253ffd2568c1f1b48a71558a000000000000000000000000186181e225dc1ad85a4a94164232bd261e351c330000000000000000000000000000000000000000000000000000000000000001dfc80050d829ddbf5dc8ea3f1b9da5c68a4cbd7a000200000000000000000003000000000000000000000000f4b5cd842e1962ca5b59327fe4bbf5b845c18669',
    nonce: '0x53',
    value: '0x0',
    v: '0x22df7',
    r: '0xebebe83bc6446a87b8e10fae8c2f1b27c4952f9af64aa58dd7c51d13f75853ef',
    s: '0x302ed43aa049bf8852f39893ca576fdee39efbf3d854cdd8aa8ee11fef3137c5',
  },
}

describe('Arbitrage bot machine definition', () => {
  let arbitrageDefinition: any
  let arbitrageStateMachineArn: string

  const arbitrageInput = {
    arbitragePair: {
      poolNameForSell: 'yokaiWbtcWckb',
      poolNameForBuy: 'hadoukenWbtcCkb',
      baseToken: 'WBTC|eth',
      quoteToken: 'CKB',
      quoteTokenThreshold: '21866500000000',
      minProfit: '36000000000000000000',
    },
    chainId: '0x116ea',
  }

  const wrongInput = {
    arbitragePair: {
      poolNameForSell: 'yokaiWbtcWckb',
      poolNameForBuy: 'hadoukenWbtcCkb',
      baseToken: 'WBTC|eth',
      wrong: 'wrong',
      quoteTokenThreshold: '21866500000000',
      minProfit: '36000000000000000000',
    },
    chainId: '0x116ea',
  }

  beforeAll(async () => {
    arbitrageDefinition = readStateMachineDefinition(
      __dirname + '/../template.yml',
      arbitrageMachineName,
      (definition) => {
        definition.States.ValidateInput.Resource = dummyArn
        definition.States.CalculateTradeVolume.Resource = dummyArn
        definition.States.SendTx.Resource = dummyArn
        definition.States.GetTxReceipt.Resource = dummyArn
        definition.States.ProcessTxReceipt.Resource = dummyArn
        definition.States.RepeatFunctionExecution.Resource = dummyArn
        definition.States.CheckMaximumNumberOfIterations.Default = 'Done'
        definition.States.Done = { Type: 'Succeed' }
        return definition
      },
    )
  })

  beforeEach(async () => {
    arbitrageStateMachineArn = await helper.createOrUpdateStateMachine(
      arbitrageDefinition,
      arbitrageMachineName,
    )
  })

  it('found arbitrage trade', async () => {
    const executionHistory = await helper.runAndWait(
      arbitrageStateMachineArn,
      arbitrageInput,
      'HappyPath',
    )
    const validateCalls = executionHistory.getCallsTo('ValidateInput')
    expect(validateCalls.length).toBe(1)
    expect(validateCalls[0].parsedInput).toMatchObject({
      ...arbitrageInput,
      stateName: 'ValidateInput',
    })
    const tradeVolumeCall = executionHistory.getCallsTo('CalculateTradeVolume')
    expect(tradeVolumeCall.length).toBe(1)
    expect(tradeVolumeCall[0].parsedInput).toMatchObject({
      ...arbitrageInput,
      stateName: 'CalculateTradeVolume',
      arbitragePair: {
        quoteToken: 'CKB',
        baseToken: 'WBTC|eth',
      },
      subgraphBlocksBehind: 0,
    })
    const arbitrageCall = executionHistory.getCallsTo('SendTx')
    expect(arbitrageCall.length).toBe(1)
    expect(arbitrageCall[0].parsedInput).toMatchObject({
      ...arbitrageInput,
      stateName: 'SendTx',
      arbitragePair: {
        quoteToken: 'CKB',
        baseToken: 'WBTC|eth',
      },
      quoteAmount: '10000000000',
      baseAmount: '100',
    })

    const txReceiptCall = executionHistory.getCallsTo('GetTxReceipt')
    expect(txReceiptCall.length).toBe(1)
    expect(txReceiptCall[0].parsedInput).toMatchObject({
      stateName: 'GetTxReceipt',
      txHash:
        '0x003d91e1f545e065dffe5aab7fea803af99204f1be55f16b39bd2d9c9e6a7973',
    })

    const txRequestCall = executionHistory.getCallsTo('ProcessTxReceipt')
    expect(txRequestCall.length).toBe(1)
    expect(txRequestCall[0].parsedInput).toMatchObject({
      txReceipt,
    })
  })

  it('No arbitrage opportunity', async () => {
    const executionHistory = await helper.runAndWait(
      arbitrageStateMachineArn,
      arbitrageInput,
      'NoArbitrageOpportunity',
    )
    const tradeVolumeCall = executionHistory.getCallsTo('CalculateTradeVolume')
    expect(tradeVolumeCall.length).toBe(1)
    expect(tradeVolumeCall[0].parsedInput).toMatchObject({
      stateName: 'CalculateTradeVolume',
      arbitragePair: {
        quoteToken: 'CKB',
        baseToken: 'WBTC|eth',
      },
      subgraphBlocksBehind: 0,
    })
    const sendTxCall = executionHistory.getCallsTo('SendTx')
    expect(sendTxCall.length).toBe(0)
  })

  it('Invalid input data', async () => {
    const executionHistory = await helper.runAndWait(
      arbitrageStateMachineArn,
      arbitrageInput,
      'InvalidPairData',
      'FAILED',
    )
    const tradeVolumeCall = executionHistory.getCallsTo('CalculateTradeVolume')
    expect(tradeVolumeCall.length).toBe(0)
  })

  it('Failed to send tx route entered WaitForNextIteration', async () => {
    const executionHistory = await helper.runAndWait(
      arbitrageStateMachineArn,
      arbitrageInput,
      'FailsToSendTx',
      'SUCCEEDED',
    )

    const tradeVolumeCall = executionHistory.getCallsTo('CalculateTradeVolume')
    expect(tradeVolumeCall.length).toBe(1)
    expect(tradeVolumeCall[0].parsedInput).toMatchObject({
      stateName: 'CalculateTradeVolume',
      arbitragePair: {
        baseToken: 'WBTC|eth',
        quoteToken: 'CKB',
      },
    })
    const sendTxCall = executionHistory.getCallsTo('SendTx')
    expect(sendTxCall.length).toBe(1)

    const waitedState = executionHistory.getEnteredWaitedStatesName()
    expect(waitedState.includes('WaitForNextIteration')).toBe(true)
  })

  it('validateInput works', async () => {
    const executionHistory = await helper.runAndWait(
      arbitrageStateMachineArn,
      arbitrageInput,
      'HappyPath',
    )
    const validateCalls = executionHistory.getCallsTo('ValidateInput')
    expect(validateCalls.length).toBe(1)
    expect(validateCalls[0].parsedInput).toMatchObject({
      ...arbitrageInput,
      stateName: 'ValidateInput',
    })

    const tradeVolumeCall = executionHistory.getCallsTo('CalculateTradeVolume')
    expect(tradeVolumeCall.length).toBe(1)
  })

  it('ValidationInput step failed', async () => {
    const executionHistory = await helper.runAndWait(
      arbitrageStateMachineArn,
      wrongInput,
      'ValidationThrowError',
      'FAILED',
    )
    const validateCalls = executionHistory.getCallsTo('ValidateInput')
    expect(validateCalls.length).toBe(1)
    expect(validateCalls[0].parsedInput).toMatchObject({
      ...wrongInput,
      stateName: 'ValidateInput',
    })
    const tradeVolumeCall = executionHistory.getCallsTo('CalculateTradeVolume')
    expect(tradeVolumeCall.length).toBe(0)
  })
})

describe('Linear bot machine definition', () => {
  let linearDefinition: any
  let linearStateMachineArn: string

  const linearInput = {
    poolName: 'LinearUSDC',
    chainId: '0x116ea',
  }

  beforeAll(async () => {
    linearDefinition = readStateMachineDefinition(
      __dirname + '/../template.yml',
      linearMachineName,
      (definition) => {
        definition.States.ValidateInput.Resource = dummyArn
        definition.States.GetIfIsOutOfRange.Resource = dummyArn
        definition.States.SendTx.Resource = dummyArn
        definition.States.GetTxReceipt.Resource = dummyArn
        definition.States.ProcessTxReceipt.Resource = dummyArn
        definition.States.RepeatFunctionExecution.Resource = dummyArn
        definition.States.CheckMaximumNumberOfIterations.Default = 'Done'
        definition.States.Done = { Type: 'Succeed' }
        return definition
      },
    )
  })

  beforeEach(async () => {
    linearStateMachineArn = await helper.createOrUpdateStateMachine(
      linearDefinition,
      linearMachineName,
    )
  })

  it('Linear pool is inside range', async () => {
    const executionHistory = await helper.runAndWait(
      linearStateMachineArn,
      linearInput,
      'PoolIsUnbalanced',
    )

    const validateCalls = executionHistory.getCallsTo('ValidateInput')
    expect(validateCalls.length).toBe(1)
    expect(validateCalls[0].parsedInput).toMatchObject({
      ...linearInput,
      stateName: 'ValidateInput',
    })

    const checkLinearPoolTargets =
      executionHistory.getCallsTo('GetIfIsOutOfRange')
    expect(checkLinearPoolTargets.length).toBe(1)
    expect(checkLinearPoolTargets[0].parsedInput).toMatchObject({
      ...linearInput,
      stateName: 'GetIfIsOutOfRange',
    })
  })

  it('Linear pool is outside range', async () => {
    const executionHistory = await helper.runAndWait(
      linearStateMachineArn,
      linearInput,
      'PoolIsUnbalanced',
    )

    const validateCalls = executionHistory.getCallsTo('ValidateInput')
    expect(validateCalls.length).toBe(1)
    expect(validateCalls[0].parsedInput).toMatchObject({
      ...linearInput,
      stateName: 'ValidateInput',
    })

    const checkLinearPoolTargets =
      executionHistory.getCallsTo('GetIfIsOutOfRange')
    expect(checkLinearPoolTargets.length).toBe(1)
    expect(checkLinearPoolTargets[0].parsedInput).toMatchObject({
      ...linearInput,
      stateName: 'GetIfIsOutOfRange',
    })

    const linearCall = executionHistory.getCallsTo('SendTx')
    expect(linearCall.length).toBe(0)
  })
})

describe('Binance bot machine definition', () => {
  let binanceDefinition: any
  let binanceStateMachineArn: string

  const binanceInput = {
    poolNameForBuy: 'binanceETHUSDC',
    poolNameForSell: 'hadoukenCkbEthUsdc',
    baseTokenSymbol: 'ETH',
    quoteTokenSymbol: 'USDT',
    quoteTokenThreshold: '1',
    minProfit: '0',
    chainId: '0x116ea',
  }

  beforeAll(async () => {
    binanceDefinition = readStateMachineDefinition(
      __dirname + '/../binance.yml',
      binanceMachineName,
      (definition) => {
        definition.States.ValidateInput.Resource = dummyArn
        definition.States.FindOpportunity.Resource = dummyArn
        definition.States.ExecuteTradeOnBinance.Resource = dummyArn
        definition.States.ExecuteTradeOnHadouken.Resource = dummyArn
        definition.States.GetTxReceipt.Resource = dummyArn
        definition.States.ProcessTxReceipt.Resource = dummyArn
        definition.States.RepeatFunctionExecution.Resource = dummyArn
        definition.States.CheckMaximumNumberOfIterations.Default = 'Done'
        definition.States.Done = { Type: 'Succeed' }
        return definition
      },
    )
  })

  beforeEach(async () => {
    binanceStateMachineArn = await helper.createOrUpdateStateMachine(
      binanceDefinition,
      binanceMachineName,
    )
  })

  it('Step function flow is valid', async () => {
    const executionHistory = await helper.runAndWait(
      binanceStateMachineArn,
      binanceInput,
      'FlowIsValid',
    )

    const validateCalls = executionHistory.getCallsTo('ValidateInput')
    expect(validateCalls.length).toBe(1)
    expect(validateCalls[0].parsedInput).toMatchObject({
      ...binanceInput,
      stateName: 'ValidateInput',
    })

    const findOpportunity = executionHistory.getCallsTo('FindOpportunity')
    expect(findOpportunity.length).toBe(1)
    expect(findOpportunity[0].parsedInput).toMatchObject({
      ...binanceInput,
      stateName: 'FindOpportunity',
      subgraphBlocksBehind: 0,
    })

    const executeTradeOnBinance = executionHistory.getCallsTo(
      'ExecuteTradeOnBinance',
    )
    expect(executeTradeOnBinance.length).toBe(1)
    expect(executeTradeOnBinance[0].parsedInput).toMatchObject({
      stateName: 'ExecuteTradeOnBinance',
      poolNameForBuy: 'binanceETHUSDC',
      baseAmount: '20000000',
      quoteAmount: '124',
      baseTokenSymbol: 'ETH',
      quoteTokenSymbol: 'USDT',
    })

    const executeTradeOnHadouken = executionHistory.getCallsTo(
      'ExecuteTradeOnHadouken',
    )
    expect(executeTradeOnHadouken.length).toBe(1)
    expect(executeTradeOnHadouken[0].parsedInput).toMatchObject({
      stateName: 'ExecuteTradeOnHadouken',
      poolNameForBuy: 'binanceETHUSDC',
      quoteAmount: '300000000',
      baseAmount: '300000000000000000',
      baseTokenSymbol: 'ETH',
      quoteTokenSymbol: 'USDT',
    })
  })
})

describe('Liquidation bot machine definition', () => {
  let liquidationDefinition: any
  let liquidationStateMachineArn: string

  const liquidationInput = {
    chainId: '0x116ea',
  }

  beforeAll(async () => {
    liquidationDefinition = readStateMachineDefinition(
      __dirname + '/../liquidation.yml',
      liquidationMachineName,
      (definition) => {
        definition.States.ValidateInput.Resource = dummyArn
        definition.States.FindUserToLiquidate.Resource = dummyArn
        definition.States.LiquidateUser.Resource = dummyArn
        definition.States.GetTxReceipt.Resource = dummyArn
        definition.States.ProcessTxReceipt.Resource = dummyArn
        definition.States.CheckMaximumNumberOfIterations.Default = 'Done'
        definition.States.Done = { Type: 'Succeed' }
        return definition
      },
    )
  })

  beforeEach(async () => {
    liquidationStateMachineArn = await helper.createOrUpdateStateMachine(
      liquidationDefinition,
      liquidationMachineName,
    )
  })

  it('Find and liquidate user', async () => {
    const executionHistory = await helper.runAndWait(
      liquidationStateMachineArn,
      liquidationInput,
      'HappyPath',
    )
    const findUser = executionHistory.getCallsTo('FindUserToLiquidate')
    expect(findUser.length).toBe(1)
    expect(findUser[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'FindUserToLiquidate',
    })

    const liquidateUser = executionHistory.getCallsTo('LiquidateUser')
    expect(liquidateUser.length).toBe(1)
    expect(liquidateUser[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'LiquidateUser',
      collateralToken: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
      debtToken: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
      userAddress: '0xA14d06ee65f19EA64548CA2effCc26925823827d',
      amount: '1000000',
    })

    const getTxReceipt = executionHistory.getCallsTo('GetTxReceipt')
    expect(getTxReceipt.length).toBe(1)
    expect(getTxReceipt[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'GetTxReceipt',
      txHash:
        '0x003d91e1f545e065dffe5aab7fea803af99204f1be55f16b39bd2d9c9e6a7973',
    })

    const processTxReceipt = executionHistory.getCallsTo('ProcessTxReceipt')
    expect(processTxReceipt.length).toBe(1)
    expect(processTxReceipt[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'ProcessTxReceipt',
      collateralToken: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
      debtToken: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
      userAddress: '0xA14d06ee65f19EA64548CA2effCc26925823827d',
      amount: '1000000',
      txReceipt,
    })
  })

  it('No user to liquidate', async () => {
    const executionHistory = await helper.runAndWait(
      liquidationStateMachineArn,
      liquidationInput,
      'NoLiquidation',
    )
    const findUser = executionHistory.getCallsTo('FindUserToLiquidate')
    expect(findUser.length).toBe(1)
    expect(findUser[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'FindUserToLiquidate',
    })

    const liquidateUser = executionHistory.getCallsTo('LiquidateUser')
    expect(liquidateUser.length).toBe(0)
  })

  it('Fails to liquidate user', async () => {
    const executionHistory = await helper.runAndWait(
      liquidationStateMachineArn,
      liquidationInput,
      'FailsToSendTx',
    )
    const findUser = executionHistory.getCallsTo('FindUserToLiquidate')
    expect(findUser.length).toBe(1)
    expect(findUser[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'FindUserToLiquidate',
    })

    const liquidateUser = executionHistory.getCallsTo('LiquidateUser')
    expect(liquidateUser.length).toBe(1)
    expect(liquidateUser[0].parsedInput).toMatchObject({
      ...liquidationInput,
      stateName: 'LiquidateUser',
      collateralToken: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
      debtToken: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
      userAddress: '0xA14d06ee65f19EA64548CA2effCc26925823827d',
      amount: '1000000',
    })

    const waitedState = executionHistory.getEnteredWaitedStatesName()
    expect(waitedState.includes('WaitForNextIteration')).toBe(true)
  })
})
