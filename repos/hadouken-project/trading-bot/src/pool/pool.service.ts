import { Inject, Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import { PoolYokaiData } from '@pool/pool.types'
import { YokaiPairAbi__factory } from '@abi/factories/artifacts-core/contracts/YokaiPair.sol'
import { GodwokenTokenService } from '../token/godwokenToken.service'
import { JSON_RPC_PROVIDER } from '../helpers'
@Injectable()
export class PoolService {
  constructor(
    @Inject(JSON_RPC_PROVIDER)
    private provider: ethers.providers.JsonRpcProvider,
    private readonly tokenService: GodwokenTokenService,
  ) {}

  async getYokaiPoolData(address: string): Promise<PoolYokaiData> {
    const txOverrides = {
      gasLimit: 12_000_000,
    }
    const pair = YokaiPairAbi__factory.connect(address, this.provider)
    const { _reserve0, _reserve1 } = await pair.getReserves(txOverrides)
    const token0Address = await pair.token0(txOverrides)
    const token1Address = await pair.token1(txOverrides)

    const token0 = this.tokenService.findTokenByAddress(token0Address)
    const token1 = this.tokenService.findTokenByAddress(token1Address)
    const tokenInfo = new Map([
      [
        token0.symbol,
        {
          address: token0.address,
          amount: _reserve0,
          symbol: token0.symbol,
          decimals: token0.decimals,
        },
      ],
      [
        token1.symbol,
        {
          address: token1.address,
          amount: _reserve1,
          symbol: token1.symbol,
          decimals: token1.decimals,
        },
      ],
    ])

    return { tokenInfo }
  }
}
