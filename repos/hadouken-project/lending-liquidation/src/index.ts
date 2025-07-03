import {
  connect,
  getContractsConfigStatic,
} from '@hadouken-project/lending-contracts'
import { BigNumber } from 'ethers'
import { getDeployer } from './provider'
import {
  getBackstops,
  getPrices,
  getReserves,
  getTokenBalancesFromRpc,
  getUsers,
} from './queries'

import {
  ERC20__factory,
  UserBalances,
} from '@hadouken-project/lending-contracts/dist/contracts'
import { Channel, Client, GatewayIntentBits } from 'discord.js'
import Config from './config.json'
import { CollateralReserve, DebtReserve, MaxCollateral } from './interface'
import {
  ENVIRONMENT,
  HEALTH_FACTOR_DECIMAL,
  WAIT_TRANSACTION_IN_BLOCKS,
} from './utils/constants'
import {
  calculateMaxCollateralToLiquidate,
  convertBigNumberToDecimal,
  getHealthFactor,
} from './utils/math'

const txOverrides = { gasLimit: Config.gasLimit, gasPrice: Config.gasPrice }

const channelID = process.env.CHANNEL_ID
const discordToken = process.env.CLIENT_TOKEN
const diaOracleAddress = process.env.DIA_ORACLE_ADDRESS as string
const bandOracleAddress = process.env.BAND_ORACLE_ADDRESS as string

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
let channel: Channel | undefined
const env = Config.environment

async function checkOracleBalance() {
  const deployer = await getDeployer()
  const config = getContractsConfigStatic(ENVIRONMENT)

  const ckbAddress = config.tokens.CKB.address

  const ckbToken = ERC20__factory.connect(ckbAddress, deployer)
  const ckbDecimals = await ckbToken.decimals()

  const diaOracleBalance = await ckbToken.balanceOf(diaOracleAddress)
  const bandOracleBalance = await ckbToken.balanceOf(bandOracleAddress)
  const warningThreshold = BigNumber.from(500).mul(
    BigNumber.from(10).pow(ckbDecimals),
  )
  if (diaOracleBalance.lte(warningThreshold) && channel?.isTextBased()) {
    channel.send(
      `[${env}] DIA oracle is low on CKB - current balance: ${convertBigNumberToDecimal(
        diaOracleBalance,
        ckbDecimals,
      )}`,
    )
  }
  if (bandOracleBalance.lte(warningThreshold) && channel?.isTextBased()) {
    channel.send(
      `[${env}] Band oracle is low on CKB - current balance: ${convertBigNumberToDecimal(
        bandOracleBalance,
        ckbDecimals,
      )}`,
    )
  }
}

const liquidateAll = async () => {
  const deployer = await getDeployer()
  const contracts = connect(deployer, ENVIRONMENT)
  const HealthFactorLiquidate = BigNumber.from(10).pow(HEALTH_FACTOR_DECIMAL)
  const users = await getUsers()
  const reserves = await getReserves()
  const prices = await getPrices(reserves)
  const backstops = await getBackstops(reserves)
  const nonCollateralAssets = reserves.filter((reserve) =>
    reserve.liquidityThreshold.isZero(),
  )

  const usersFixedCollateral = users
    .filter((user) => user.depositAssets.length !== 0)
    .map((user) => {
      return {
        ...user,
        depositAssets: user.depositAssets.map((deposit) => {
          const shouldBeNonCollateral = nonCollateralAssets.some(
            (reserve) =>
              reserve.aTokenAddress === deposit.tokenBalance.tokenAddress,
          )
          return {
            ...deposit,
            isCollateral: shouldBeNonCollateral ? false : deposit.isCollateral,
          }
        }),
      }
    })

  const tokenBalances = await getTokenBalancesFromRpc(
    contracts.userBalances as UserBalances,
    reserves,
    usersFixedCollateral,
  )

  const pool = contracts.pool
  const bamm = contracts.bamm

  if (!pool) return

  const usersToLiquidate: {
    id: string
    debtToken: DebtReserve
    collateralToken: CollateralReserve
    maxCollateral: MaxCollateral
  }[] = []

  usersFixedCollateral.forEach((user) => {
    const { healthFactor, borrowedTokens, collateralTokens } = getHealthFactor(
      user,
      reserves,
      tokenBalances,
      prices,
    )
    const largestDebtTokenWithBalance = borrowedTokens.reduce(function (
      prev,
      current,
    ) {
      return prev.totalDebtInDollars.gt(current.totalDebtInDollars)
        ? prev
        : current
    },
    borrowedTokens[0])

    const largestCollateralTokenWithBalance = collateralTokens.reduce(function (
      prev,
      current,
    ) {
      return prev.totalCollateralInDollars.gt(current.totalCollateralInDollars)
        ? prev
        : current
    },
    collateralTokens[0])

    if (healthFactor.lt(HealthFactorLiquidate)) {
      console.log(
        'healthFactor',
        convertBigNumberToDecimal(healthFactor, HEALTH_FACTOR_DECIMAL),
      )

      console.log(
        `top debt tokens(${largestDebtTokenWithBalance.symbol})[hs${largestDebtTokenWithBalance.stableDebtTokenAddress}, hv ${largestDebtTokenWithBalance.variableDebtTokenAddress}]`,
        convertBigNumberToDecimal(
          largestDebtTokenWithBalance.totalDebt,
          largestDebtTokenWithBalance.decimals,
        ),
        `${convertBigNumberToDecimal(
          largestDebtTokenWithBalance.totalDebtInDollars,
          18,
        )}$`,
      )

      console.log(
        `top collateral tokens(${largestCollateralTokenWithBalance.symbol})[${largestCollateralTokenWithBalance.aTokenAddress}]`,

        convertBigNumberToDecimal(
          largestCollateralTokenWithBalance.totalCollateral,
          largestCollateralTokenWithBalance.decimals,
        ),
        `${convertBigNumberToDecimal(
          largestCollateralTokenWithBalance.totalCollateralInDollars,
          18,
        )}$`,
      )

      const maxCollateral = calculateMaxCollateralToLiquidate(
        largestDebtTokenWithBalance,
        largestCollateralTokenWithBalance,
        prices,
      )

      usersToLiquidate.push({
        id: user.id,
        debtToken: largestDebtTokenWithBalance,
        collateralToken: largestCollateralTokenWithBalance,
        maxCollateral: maxCollateral,
      })
    }
  })

  const sortedUsers = usersToLiquidate.sort((user1, user2) =>
    user1.maxCollateral.maxAmountCollateralToLiquidateInDollars.gt(
      user2.maxCollateral.maxAmountCollateralToLiquidateInDollars,
    )
      ? -1
      : 1,
  )

  console.log(
    'all users that will be liquidated in order',
    sortedUsers.map((x) => ({
      value: convertBigNumberToDecimal(
        x.maxCollateral.maxAmountCollateralToLiquidateInDollars,
        27,
      ),
      symbol: `${x.debtToken.symbol}/${x.collateralToken.symbol}`,
      id: x.id,
    })),
  )

  for (const user of sortedUsers) {
    console.log('Executing liquidation with parameters', {
      user: user.id,
      debtToLiquidate: convertBigNumberToDecimal(
        user.debtToken.totalDebt,
        user.debtToken.decimals,
      ),
      poolAddress: pool.address,
    })

    const collateral = user.collateralToken.address
    const debt = user.debtToken.address
    const userAddress = user.id
    const debtToCover = user.debtToken.totalDebt
    const receiveAToken = Config.receiveAToken

    const backstop = backstops.find((reserve) => reserve.address === debt)
    const debtTokenDec = convertBigNumberToDecimal(
      debtToCover,
      user.debtToken.decimals,
    )

    if (backstop) {
      const BAMM = await bamm?.(backstop.BAMM)
      const cBorrowToken = await BAMM?.cBorrow(txOverrides)
      const canLiquidate = await BAMM?.canLiquidate(
        debt,
        collateral,
        debtToCover,
        txOverrides,
      )
      if (canLiquidate) {
        console.log('Using backstop with address: ', backstop)
        try {
          if (!cBorrowToken) {
            throw Error('CBorrow token is missing in BAMM')
          }
          const staticCallData = await BAMM?.callStatic.liquidateBorrow(
            userAddress,
            debtToCover,
            user.collateralToken.aTokenAddress,
            txOverrides,
          )

          const estimatedGas = await BAMM?.estimateGas.liquidateBorrow(
            userAddress,
            debtToCover,
            user.collateralToken.aTokenAddress,
            txOverrides,
          )

          const call = await BAMM?.liquidateBorrow(
            userAddress,
            debtToCover,
            user.collateralToken.aTokenAddress,
            { gasPrice: Config.gasPrice, gasLimit: estimatedGas?.mul(3) },
          )
          const data = await call?.wait(WAIT_TRANSACTION_IN_BLOCKS)
          if (channel?.isTextBased()) {
            channel.send(
              `[${env}] Liquidated user: ${userAddress} through Backstop pool with: ${debtTokenDec} ${user.debtToken.symbol} for ${user.collateralToken.symbol}`,
            )
          }
        } catch (error) {
          console.error(error)
          if (channel?.isTextBased()) {
            channel.send(
              `[${env}] Failed to liquidated user: ${userAddress} through Backstop pool with: ${debtTokenDec} ${user.debtToken.symbol} for ${user.collateralToken.symbol}`,
            )
          }
        }
      }
    }

    try {
      await (
        await contracts
          .token(user.debtToken.address)
          .approve(pool.address, user.debtToken.totalDebt)
      ).wait(WAIT_TRANSACTION_IN_BLOCKS)

      const estimatedGas = await pool.estimateGas.liquidationCall(
        collateral,
        debt,
        userAddress,
        debtToCover,
        receiveAToken,
        txOverrides,
      )
      const call = await pool.liquidationCall(
        collateral,
        debt,
        userAddress,
        debtToCover,
        receiveAToken,
        { gasPrice: Config.gasPrice, gasLimit: estimatedGas.mul(2) },
      )
      const data = await call?.wait(WAIT_TRANSACTION_IN_BLOCKS)
      if (channel?.isTextBased()) {
        channel.send(
          `[${env}] Liquidated user: ${userAddress} with: ${debtTokenDec} ${user.debtToken.symbol} for ${user.collateralToken.symbol}`,
        )
      }
    } catch (error) {
      console.error(error)
      if (channel?.isTextBased()) {
        channel.send(
          `[${env}] Failed to liquidated user: ${userAddress} with: ${debtTokenDec} ${user.debtToken.symbol} for ${user.collateralToken.symbol}`,
        )
      }
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const LIQUIDATE_INTERVAL = 15 * 60 * 1000 // 15 minutes in milliseconds

function getChannel() {
  const channels = client.channels.cache
  if (!channelID) {
    console.log(
      'Channel ID is not provided - using default value for liquidation channel',
    )
  }
  channel = channels.get(channelID || '1025058867664670821') // Liquidation channel ID
  return channel
}

const main = async () => {
  client.once('ready', () => {
    channel = getChannel()
    if (channel?.isTextBased()) {
      channel.send(`[${env}] Connected to discord channel`)
    } else {
      console.log('cant connect to discord channel')
    }
  })
  client.login(discordToken)
  while (true) {
    try {
      await checkOracleBalance()
      await liquidateAll()
      console.log(
        `Waiting ${LIQUIDATE_INTERVAL / 1000} seconds for next liquidation`,
      )
      await sleep(LIQUIDATE_INTERVAL)
    } catch (error) {
      console.error(error)
    }
  }
}

main()
