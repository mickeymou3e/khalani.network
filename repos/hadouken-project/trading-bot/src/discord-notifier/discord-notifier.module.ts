import { Module } from '@nestjs/common'
import { DiscordNotifierService } from './discord-notifier.service'

@Module({
  providers: [DiscordNotifierService],
  exports: [DiscordNotifierService],
})
export class DiscordNotifierModule {}
