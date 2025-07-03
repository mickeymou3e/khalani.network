import { Module } from '@nestjs/common'
import { BalanceFetcherModule } from '../balance-fetcher/balance-fetcher.module'
import { DataModule } from '../data/data.module'
import { BalanceService } from './balance.service'

@Module({
  imports: [BalanceFetcherModule, DataModule],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
