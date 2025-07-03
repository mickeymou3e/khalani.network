import Header from '@components/Header/Header.component'
import { Footer, LogoIcon, WarningBanner } from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'

import type { AppProps } from 'next/app'
import { ThemeProvider } from '../styles/theme'

const discordLink = 'https://discord.com/invite/pxZJpJPJBH'
const twitterLink = 'https://twitter.com/HadoukenFinance'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Box position="sticky" top={0} zIndex={1000}>
        <WarningBanner
          title="Important Notice:"
          description={
            <Box>
              <Typography variant="buttonSmall">
                We will be discontinuing the Hadouken product. The final day of
                service will be
                <b> December 31, 2024</b>.
              </Typography>
              <Typography sx={{ pt: 0.5 }} variant="buttonSmall">
                Please close all your positions and withdraw all your assets by
                the end of this year.
              </Typography>
            </Box>
          }
        />
        <Header />
      </Box>
      <Box>
        <Component {...pageProps} />
      </Box>
      <Footer
        logo={LogoIcon}
        discordLink={discordLink}
        twitterLink={twitterLink}
      />
    </ThemeProvider>
  )
}

export default MyApp
