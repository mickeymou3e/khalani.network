import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import DiscordIcon from '@components/icons/socials/Discord'
import TwitterIcon from '@components/icons/socials/Twitter'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { messages } from './Footer.messages'
import { CustomizedFooter } from './Footer.styled'
import { IFooterProps } from './Footer.types'

const Footer: React.FC<IFooterProps> = ({ discordLink, twitterLink }) => {
  return (
    <CustomizedFooter>
      <Typography variant="body1" color="text.primary">
        {messages.FIND_US}
      </Typography>
      <Box gap={1} display="flex" alignItems="center">
        {discordLink && (
          <Link
            url={discordLink}
            linkType={LinkEnum.External}
            lineHeight={'100%'}
          >
            <DiscordIcon />
          </Link>
        )}
        {twitterLink && (
          <Link
            url={twitterLink}
            linkType={LinkEnum.External}
            lineHeight={'100%'}
          >
            <TwitterIcon />
          </Link>
        )}
      </Box>
    </CustomizedFooter>
  )
}

export default Footer
