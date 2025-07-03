import { Module } from '@nestjs/common'
import { ChartService } from './chart.service'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { HadoukenSwapModule } from '../hadouken-swap/hadouken-swap.module'

@Module({
  imports: [EthersProviderModule, HadoukenSwapModule],
  providers: [ChartService],
  exports: [ChartService],
})
export class ChartModule {}
