import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MainClient } from 'binance'
import { getSecret } from '../aws-sdk/utils'

export const BINANCE_BASE_URL = 'BINANCE_BASE_URL'
@Module({
  providers: [
    // {
    //   provide: BINANCE_BASE_URL,
    //   useValue: 'https://testnet.binance.vision',
    // },
    /* For prod below: */
    {
      provide: 'BINANCE_BASE_URL',
      useValue: 'https://api.binance.com',
    },
    {
      provide: MainClient,
      useFactory: async (configService: ConfigService, baseUrl: string) => {
        const secrets = await getSecret(
          configService.get('BINANCE_SECRETS'),
          configService.get('BINANCE_REGION_ACTIVE'),
        )

        return new MainClient({
          // api_key: secrets['BINANCE_TEST_APIKEY'],
          // api_secret: secrets['BINANCE_TEST_APISECRETKEY'],
          api_key: secrets['BINANCE_PROD_APIKEY'],
          api_secret: secrets['BINANCE_PROD_APISECRETKEY'],
          beautifyResponses: true,
          baseUrl,
        })
      },
      inject: [ConfigService, BINANCE_BASE_URL],
    },
  ],
  exports: [MainClient, BINANCE_BASE_URL],
})
export class BinanceClientModule {}
