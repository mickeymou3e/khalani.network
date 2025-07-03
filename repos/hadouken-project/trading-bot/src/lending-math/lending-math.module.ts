import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LendingMathService } from './lending-math.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [LendingMathService],
  exports: [LendingMathService],
})
export class LendingMathModule {}
