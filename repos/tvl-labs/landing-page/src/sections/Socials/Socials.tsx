import { Box, Link, useMediaQuery } from '@mui/material'
import logo from '@images/logo.png'
import {
  IconsContainer,
  LogoIcon,
  ResponsiveH3,
  SocialBackground,
  StyledImage,
} from './Socials.styled'
import { socialLinks } from './Socials.constants'

const Socials = () => {
  const isCustomizedMobile = useMediaQuery(`(max-width: 600px)`)

  return (
    <SocialBackground
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-start"
        className="footer-logo"
      >
        <Box display="flex" alignItems="center" pr={isCustomizedMobile ? 2 : 0}>
          <LogoIcon src={logo} />
        </Box>
      </Box>

      <IconsContainer>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            borderLeft: '3px solid #619bbe',
          }}
        >
          <ResponsiveH3 variant="h3" textAlign={'center'}>
            Become a Khalanian
          </ResponsiveH3>
          <Box display="flex">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                underline="none"
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'flex-end' }}
              >
                <StyledImage src={link.icon} alt={link.label} />
              </Link>
            ))}
          </Box>
        </Box>
      </IconsContainer>
    </SocialBackground>
  )
}

export default Socials
