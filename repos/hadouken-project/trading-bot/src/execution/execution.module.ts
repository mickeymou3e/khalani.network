import { Module } from '@nestjs/common'
import { ExecutionService } from './execution.service'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { HadoukenSwapModule } from '../hadouken-swap/hadouken-swap.module'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [EthersProviderModule, HadoukenSwapModule, TokenModule],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
