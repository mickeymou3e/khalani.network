import { BigNumber } from 'ethers'

import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BalancerHelpers, Vault } from '@hadouken-project/typechain'
import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

import ExitParams from './serializers/ExitParams'
import JoinParams from './serializers/JoinParams'

export default class InvestService {
  constructor(
    public readonly vault: Vault,
    public readonly helpers: BalancerHelpers,
  ) {}

  public async queryExit(
    account: string,
    pool: IPool,
    amountsOut: BigNumber[],
    tokensOutAddresses: IToken['address'][],
    amountIn: BigNumber,
    exitTokenIndex: number | null,
    exactOut: boolean,
    toInternalBalance: boolean,
  ): Promise<{
    bptIn: BigNumber
    amountsOut: BigNumber[]
  }> {
    const exitParams = new ExitParams(pool)
    const data = exitParams.serialize(
      amountsOut,
      tokensOutAddresses,
      amountIn,
      exitTokenIndex,
      exactOut,
      toInternalBalance,
    )

    const result = await this.helpers.callStatic.queryExit(
      pool.id,
      account,
      account,
      data,
    )
    return result
  }

  public async exit(
    account: string,
    pool: IPool,
    amountsOut: BigNumber[],
    tokensOutAddresses: IToken['address'][],
    amountIn: BigNumber,
    exitTokenIndex: number | null,
    exactOut: boolean,
    toInternalBalance: boolean,
  ): Promise<TransactionResponse> {
    const exitParams = new ExitParams(pool)
    const data = exitParams.serialize(
      amountsOut,
      tokensOutAddresses,
      amountIn,
      exitTokenIndex,
      exactOut,
      toInternalBalance,
    )

    const transactionResult = await this.vault.exitPool(
      pool.id,
      account,
      account,
      data,
    )
    return transactionResult
  }

  public async queryJoin(
    account: string,
    pool: IPool,
    amountsIn: BigNumber[],
    tokensIn: string[],
    lpAmountOut: BigNumber = BigNumber.from(0),
    fromInternalBalance = false,
  ): Promise<{
    amountTokenOut: BigNumber
    amountsIn: BigNumber[]
  }> {
    const joinParams = new JoinParams(pool)
    const data = joinParams.serialize(
      amountsIn,
      tokensIn,
      lpAmountOut,
      fromInternalBalance,
    )

    const joinPreview = await this.helpers.callStatic.queryJoin(
      pool.id,
      account,
      account,
      data,
    )

    return {
      amountsIn: joinPreview.amountsIn,
      amountTokenOut: joinPreview.bptOut,
    }
  }

  public async join(
    account: string,
    pool: IPool,
    amountsIn: BigNumber[],
    tokensIn: string[],
    lpAmountOut: BigNumber = BigNumber.from(0),
    fromInternalBalance = false,
    ethAmount?: BigNumber,
  ): Promise<TransactionResponse> {
    const joinParams = new JoinParams(pool)
    const data = joinParams.serialize(
      amountsIn,
      tokensIn,
      lpAmountOut,
      fromInternalBalance,
    )
    return await this.vault.joinPool(pool.id, account, account, data, {
      value: ethAmount,
    })
  }
}
