import config from '@config/'
import discord from '@images/discord.png'
import twitter from '@images/twitter.png'
import github from '@images/github.png'
import linkedin from '@images/linkedin.png'
import hashnode from '@images/hashnode.png'
import telegram from '@images/telegram.png'

export const socialLinks = [
  { url: config.socials[0].url, icon: twitter, label: 'twitter' },
  { url: config.socials[1].url, icon: discord, label: 'discord' },
  { url: config.socials[2].url, icon: github, label: 'github' },
  { url: config.socials[3].url, icon: linkedin, label: 'linkedin' },
  { url: config.socials[4].url, icon: telegram, label: 'telegram' },
  { url: config.socials[5].url, icon: hashnode, label: 'hashnode' },
]
