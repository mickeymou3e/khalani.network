import { Controller, Get, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { LockDropInfo, TokenPricesDto } from './type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('lockdrops')
  async getLockdrops(
    @Query('chainId') chainId?: string,
    @Query('user') user?: string,
  ): Promise<LockDropInfo> {
    try {
      const response = await this.appService.getLockDropInfo(chainId, user);
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  @Get('tvl')
  async getTotalValueLocked(@Query('chainId') chainId?: string): Promise<{
    totalValueLocked: string;
    totalValueLockedWithWeights: string;
  }> {
    const { tvl, tvlWithWeight } =
      await this.appService.getTotalValueLocked(chainId);

    return {
      totalValueLocked: tvl.toString(),
      totalValueLockedWithWeights: tvlWithWeight.toString(),
    };
  }

  @Get('prices')
  async getPrices(): Promise<TokenPricesDto> {
    const prices = await this.appService.getPrices();
    const tokens = Object.keys(prices);
    return tokens.reduce((acc, token) => {
      acc[token] = prices[token].toString();
      return acc;
    }, {} as TokenPricesDto);
  }

  @Get('participation')
  async getParticipation(@Query('chainId') chainId?: string): Promise<string> {
    const participation = await this.appService.getParticipation(chainId);
    return participation.toString();
  }
}
