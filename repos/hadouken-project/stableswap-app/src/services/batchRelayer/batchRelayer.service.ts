import { BigNumber, BytesLike, ContractTransaction } from 'ethers'

import {
  BalancerRelayer,
  BatchRelayerLibrary__factory,
} from '@hadouken-project/typechain'

import {
  EncodeAaveDepositInput,
  EncodeAaveWithdrawInput,
  EncodeBackstopDepositInput,
  EncodeBatchSwapInput,
  EncodeExitPoolInput,
  EncodeJoinPoolInput,
  EncodeRefundTokens,
  UserBalanceOpKind,
} from '../pools/types'

export default class BatchRelayerService {
  private balancerRelayer: BalancerRelayer

  constructor(public readonly _balancerRelayer: BalancerRelayer) {
    this.balancerRelayer = _balancerRelayer
  }

  public async multicall(
    data: BytesLike[],
    value?: BigNumber,
  ): Promise<ContractTransaction> {
    return await this.balancerRelayer.multicall(data, { value: value })
  }

  public async staticMulticall(data: BytesLike[]): Promise<string[]> {
    return await this.balancerRelayer.callStatic.multicall(data)
  }

  public encodeApproveToken(address: string, amount: BigNumber): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'approveVault',
      [address, amount],
    )
  }

  public encodeManageUserBalance(
    kind: UserBalanceOpKind,
    asset: string,
    amount: BigNumber,
    sender: string,
    recipient: string,
  ): string {
    const data = [
      {
        kind: kind,
        asset: asset,
        amount: amount,
        sender: sender,
        recipient: recipient,
      },
    ]

    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'manageUserBalance',
      [data, 0],
    )
  }

  public encodeDepositAaveToken(params: EncodeAaveDepositInput): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'wrapAaveDynamicToken',
      [
        params.staticToken,
        params.sender,
        params.recipient,
        params.amount,
        params.fromUnderlying,
        params.outputReference,
      ],
    )
  }

  public encodeWithdrawAaveToken(params: EncodeAaveWithdrawInput): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'unwrapAaveStaticToken',
      [
        params.staticToken,
        params.sender,
        params.recipient,
        params.amount,
        params.toUnderlying,
        params.outputReference,
      ],
    )
  }

  public encodeBatchSwap(params: EncodeBatchSwapInput): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'batchSwap',
      [
        params.swapType,
        params.swaps,
        params.assets,
        params.funds,
        params.limits,
        params.deadline,
        params.value.toString(),
        params.outputReferences,
      ],
    )
  }

  public encodeRefundTokens(params: EncodeRefundTokens): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'refundTokens',
      [params.tokens, params.recipient],
    )
  }

  public encodeJoinPool(params: EncodeJoinPoolInput): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'joinPool',
      [
        params.poolId,
        params.poolKind,
        params.sender,
        params.recipient,
        params.joinPoolRequest,
        params.value,
        params.outputReference,
      ],
    )
  }

  public encodeExitPool(params: EncodeExitPoolInput): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'exitPool',
      [
        params.poolId,
        params.poolKind,
        params.sender,
        params.recipient,
        params.exitPoolRequest,
        params.outputReferences,
      ],
    )
  }

  public encodeDepositBackstopToken(
    params: EncodeBackstopDepositInput,
  ): string {
    return BatchRelayerLibrary__factory.createInterface().encodeFunctionData(
      'depositToBackstop',
      [
        params.triCryptoBackstop,
        params.sender,
        params.recipient,
        params.amount,
      ],
    )
  }
}
