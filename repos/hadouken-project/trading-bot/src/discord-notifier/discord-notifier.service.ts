import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fetch from 'cross-fetch'

@Injectable()
export class DiscordNotifierService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(DiscordNotifierService.name)

  async sendNotification(message: string) {
    this.logger.log('__Sending Discord notification__')
    try {
      await fetch(this.configService.get('DISCORD_WEBHOOK_URL'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
      })
    } catch (error) {
      this.logger.error(error)
    }
  }
}
