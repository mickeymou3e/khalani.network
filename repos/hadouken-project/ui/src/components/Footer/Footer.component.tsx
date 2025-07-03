import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import DiscordIcon from '@components/icons/socials/Discord'
import GithubIcon from '@components/icons/socials/Github'
import TwitterIcon from '@components/icons/socials/Twitter'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import { messages } from './Footer.messages'
import { IFooterProps } from './Footer.types'

const StyledLink = styled(Link)({
  background: 'none',
  display: 'flex',
  width: '25px',
})

const Footer: React.FC<IFooterProps> = ({
  discordLink,
  githubLink,
  logo: Logo,
  twitterLink,
}) => {
  const theme = useTheme()
  return (
    <footer
      style={{
        backgroundColor: theme.palette.background.paper,
        marginTop: 'auto',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems="center"
        py={{ xs: 3, lg: 4 }}
        px={{ xs: 4, lg: 9 }}
      >
        <Box>{Logo && <Logo />}</Box>
        <Box
          pt={{ xs: 2, md: 0 }}
          gap={2.5}
          width="100%"
          display="flex"
          justifyContent={{ xs: 'center', md: 'end' }}
          alignItems="center"
        >
          <Typography
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.quaternary}
          >
            {messages.FIND_US}
          </Typography>
          <Box gap={2} display="flex" alignItems="center">
            {discordLink && (
              <StyledLink url={discordLink} linkType={LinkEnum.External}>
                <DiscordIcon />
              </StyledLink>
            )}
            {twitterLink && (
              <StyledLink url={twitterLink} linkType={LinkEnum.External}>
                <TwitterIcon />
              </StyledLink>
            )}
            {githubLink && (
              <StyledLink url={githubLink} linkType={LinkEnum.External}>
                <GithubIcon />
              </StyledLink>
            )}
          </Box>
        </Box>
      </Box>
    </footer>
  )
}

export default Footer
