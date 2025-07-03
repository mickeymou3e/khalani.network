import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { DiscordNotifierService } from './discord-notifier.service'

const DISCORD_WEBHOOK_URL = 'DISCORD_WEBHOOK_URL_MOCK'

describe('DiscordNotifierService', () => {
  let service: DiscordNotifierService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          isGlobal: true,
          load: [
            () => ({
              DISCORD_WEBHOOK_URL,
            }),
          ],
        }),
      ],
      providers: [DiscordNotifierService],
    }).compile()

    service = module.get<DiscordNotifierService>(DiscordNotifierService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
