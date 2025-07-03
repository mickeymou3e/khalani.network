import { gql, request } from 'graphql-request'
import { BigNumber } from 'ethers'
import { DepositAsset, TokenBalance, User, Reserve, Price } from '../interface'

import Config from '../config.json'
import { getDeployer } from '../provider'
import { connect } from '@hadouken-project/lending-contracts'
import { ENVIRONMENT } from '../utils/constants'
import { UserBalances } from '@hadouken-project/lending-contracts/dist/contracts'

const usersQuery = gql`
  {
    users {
      id
      depositAssets {
        isCollateral
        TokenBalance {
          id
          walletAddress
          tokenAddress
          balance
        }
      }
    }
  }
`

const reservesQuery = gql`
  {
    reserves {
      address
      symbol
      decimals
      variableBorrowIndex
      variableBorrowRate
      stableBorrowRate
      liquidityIndex
      liquidityRate
      liquidityThreshold
      aTokenAddress
      variableDebtTokenAddress
      stableDebtTokenAddress
      liquidityBonus
      lastUpdateTimestamp
    }
  }
`

const tokenBalancesQuery = gql`
  {
    tokenBalances {
      id
      balance
      tokenAddress
      walletAddress
    }
  }
`

const tokenBalanceTypes = (tokenBalance: TokenBalance): TokenBalance => {
  const { id, balance, walletAddress, tokenAddress } = tokenBalance
  const newTokenBalance: TokenBalance = {
    id,
    balance: BigNumber.from(balance),
    walletAddress,
    tokenAddress,
  }
  return newTokenBalance
}

export const getBackstops = async (reserves: Reserve[]) => {
  const deployer = await getDeployer()
  const contracts = connect(deployer, ENVIRONMENT)
  const lendingPool = contracts.pool
  const backstops = await Promise.all(
    reserves.map(async (reserve) => ({
      BAMM:
        (await lendingPool?.getBProtocol(reserve.address)) ||
        '0x0000000000000000000000000000000000000000',
      ...reserve,
    })),
  )
  const filteredBackstop = backstops.filter(
    (backstop) =>
      backstop.BAMM !== '0x0000000000000000000000000000000000000000',
  )
  return filteredBackstop
}

const defaultValue = BigNumber.from(0)

export const getUsers = async () => {
  const usersResponse = await request(Config.subgraph, usersQuery)

  const users: Array<User> = usersResponse.users.map((user: User) => {
    const { id, depositAssets } = user
    const userDepositAssets: DepositAsset[] = depositAssets.map(
      (deposit: any) => {
        const { TokenBalance, isCollateral } = deposit
        const newDeposit: DepositAsset = {
          tokenBalance: tokenBalanceTypes(TokenBalance),
          isCollateral,
        }
        return newDeposit
      },
    )
    const newUser: User = {
      id,
      depositAssets: userDepositAssets,
    }
    return newUser
  })
  return users
}

export const getPrices = async (reserves: Reserve[]) => {
  const deployer = await getDeployer()
  const contracts = connect(deployer, ENVIRONMENT)
  const oracle = contracts.hadoukenOracle
  const reserveAddresses = reserves.map((res) => res.address)
  const reserveSymbols = reserves.map((res) => res.symbol)
  const pricesResponse = await oracle?.getAssetsPrices(reserveAddresses)
  if (!pricesResponse) return []
  const prices: Array<Price> = pricesResponse.map((price, index) => {
    return {
      symbol: reserveSymbols[index],
      rate: price,
    }
  })
  return prices
}

export const getReserves = async () => {
  const reservesResponse = await request(Config.subgraph, reservesQuery)
  const reserves: Array<Reserve> = reservesResponse.reserves.map(
    (reserve: Reserve) => {
      const {
        address,
        symbol,
        decimals,
        variableBorrowIndex,
        variableBorrowRate,
        stableBorrowRate,
        liquidityIndex,
        liquidityRate,
        liquidityThreshold,
        aTokenAddress,
        variableDebtTokenAddress,
        stableDebtTokenAddress,
        lastUpdateTimestamp,
        liquidityBonus,
      } = reserve

      const newReserve: Reserve = {
        symbol,
        address,
        decimals: Number(decimals),
        variableBorrowIndex: BigNumber.from(
          variableBorrowIndex || defaultValue,
        ),
        variableBorrowRate: BigNumber.from(variableBorrowRate || defaultValue),
        stableBorrowRate: BigNumber.from(stableBorrowRate || defaultValue),
        liquidityIndex: BigNumber.from(liquidityIndex || defaultValue),
        liquidityRate: BigNumber.from(liquidityRate || defaultValue),
        liquidityThreshold: BigNumber.from(liquidityThreshold || defaultValue),
        aTokenAddress,
        variableDebtTokenAddress,
        stableDebtTokenAddress,
        liquidityBonus: BigNumber.from(liquidityBonus || defaultValue),
        lastUpdateTimestamp: BigNumber.from(
          lastUpdateTimestamp ?? BigNumber.from(Date.now()).div(1000),
        ),
      }
      return newReserve
    },
  )
  return reserves
}

// There is a bug with negative balances
export const getTokenBalances = async () => {
  const tokenBalancesResponse = await request(
    Config.subgraph,
    tokenBalancesQuery,
  )
  const tokenBalances: Array<TokenBalance> = tokenBalancesResponse.tokenBalances.map(
    (tokenBalance: TokenBalance) => tokenBalanceTypes(tokenBalance),
  )

  return tokenBalances
}

export const getTokenBalancesFromRpc = async (
  userBalances: UserBalances,
  reserves: Reserve[],
  users: User[],
) => {
  const erc20Tokens = reserves.reduce((data, reserve) => {
    data.push(reserve.address)

    return data
  }, [] as string[])

  const hTokens = reserves.reduce((data, reserve) => {
    data.push(reserve.aTokenAddress)
    return data
  }, [] as string[])

  const hsTokens = reserves.reduce((data, reserve) => {
    data.push(reserve.stableDebtTokenAddress)
    return data
  }, [] as string[])

  const hvTokens = reserves.reduce((data, reserve) => {
    data.push(reserve.variableDebtTokenAddress)
    return data
  }, [] as string[])

  const tokenBalances: TokenBalance[] = []

  for (const user of users) {
    const uBalances: TokenBalance[] = []

    const balances = await userBalances.balancesOf(
      user.id,
      erc20Tokens,
      hTokens,
      hsTokens,
      hvTokens,
      {
        gasPrice: 0,
      },
    )

    let index = 0

    erc20Tokens.forEach((erc20) => {
      uBalances.push({
        id: user.id,
        tokenAddress: erc20,
        walletAddress: user.id,
        balance: balances[index],
      })
      index += 1
    })

    hTokens.forEach((hTokens) => {
      uBalances.push({
        id: user.id,
        tokenAddress: hTokens,
        walletAddress: user.id,
        balance: balances[index],
      })
      index += 1
    })

    hsTokens.forEach((hsToken) => {
      uBalances.push({
        id: user.id,
        tokenAddress: hsToken,
        walletAddress: user.id,
        balance: balances[index],
      })
      index += 1
    })

    hvTokens.forEach((hvTokens) => {
      uBalances.push({
        id: user.id,
        tokenAddress: hvTokens,
        walletAddress: user.id,
        balance: balances[index],
      })
      index += 1
    })

    tokenBalances.push(...uBalances)
  }

  return tokenBalances
}
