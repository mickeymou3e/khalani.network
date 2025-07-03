import { Module } from '@nestjs/common'
import { PoolService } from '@pool/pool.service'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [EthersProviderModule, TokenModule],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
