import backgroundThree from '@assets/bg_bottom.png'
import backgroundTwo from '@assets/bg_mid.png'
import backgroundOne from '@assets/bg_top.png'
import ImagePanel from '@components/ImagePanel'
import Layout from '@components/Layout'
import Paragraph from '@components/Paragraph'
import { messages } from '@messages/landing'
import { Box, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Hadouken Finance</title>
        <meta name="description" content="Hadouken landing page" />
      </Head>
      <main>
        <Layout>
          <Box
            sx={{
              height: (backgroundOne as StaticImageData).height,
              width: '100%',
              backgroundSize: { xs: 'cover', md: 'cover' },
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${(backgroundOne as StaticImageData).src})`,
              backgroundPositionY: '100%',
              backgroundPositionX: 'center',
            }}
          >
            <Box
              height="100%"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              textAlign="center"
            >
              <Box marginTop={30}>
                <Box display="flex" justifyContent="center">
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography
                        variant="h1"
                        color={(theme) => theme.palette.text.quaternary}
                      >
                        {messages.HEADER_1}
                      </Typography>
                      <Typography
                        sx={{ ml: 1 }}
                        variant="h1"
                        color={(theme) => theme.palette.text.quaternary}
                      >
                        {messages.HEADER_1_1}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h1"
                        color={(theme) => theme.palette.text.quaternary}
                      >
                        {messages.HEADER_1_2}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box pt={2} display="flex" justifyContent="center">
                  <Box maxWidth={500} display="flex" justifyContent="center">
                    <Typography
                      color={(theme) => theme.palette.text.primary}
                      variant="h3"
                    >
                      {messages.DESCRIPTION_1}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" height={600}>
            <Box ml={{ xs: 6, lg: 19 }}>
              <Box maxWidth={{ xs: 250, md: 500, lg: 725 }}>
                <Paragraph
                  title={messages.HEADER_2}
                  description={messages.DESCRIPTION_2}
                />
              </Box>
            </Box>
          </Box>
          <ImagePanel image={backgroundTwo}>
            <Box height="100%">
              <Box
                pt={16}
                mr={{ xs: 6, lg: 19 }}
                display="flex"
                justifyContent="end"
              >
                <Box maxWidth={{ xs: 250, md: 500, lg: 725 }}>
                  <Paragraph
                    title={messages.HEADER_3}
                    description={messages.DESCRIPTION_3}
                  />
                </Box>
              </Box>

              <Box height="100%">
                <Box
                  height="100%"
                  display="flex"
                  alignItems="center"
                  ml={{ xs: 6, lg: 19 }}
                  pb={{ xs: 64, lg: 45 }}
                >
                  <Box maxWidth={{ xs: 250, md: 500, lg: 725 }}>
                    <Paragraph
                      title={messages.HEADER_4}
                      description={messages.DESCRIPTION_4}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </ImagePanel>

          <ImagePanel image={backgroundThree}>
            <Box pt={32} display="flex" justifyContent="end">
              <Box
                maxWidth={{ xs: 250, md: 500, lg: 725 }}
                mr={{ xs: 6, lg: 19 }}
              >
                <Paragraph
                  title={messages.HEADER_5}
                  description={messages.DESCRIPTION_5}
                />
              </Box>
            </Box>

            <Box pt={{ xs: 32, lg: 64 }}>
              <Box
                ml={{ xs: 6, lg: 19 }}
                maxWidth={{ xs: 250, md: 500, lg: 725 }}
              >
                <Box display="block">
                  <Typography
                    sx={{ display: 'inline' }}
                    variant="h1"
                    color={(theme) => theme.palette.text.quaternary}
                  >
                    {messages.HEADER_6}
                  </Typography>

                  <Typography
                    sx={{ pt: 3 }}
                    variant="h3"
                    color={(theme) => theme.palette.text.primary}
                  >
                    {messages.DESCRIPTION_6}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ImagePanel>
        </Layout>
      </main>
    </div>
  )
}

export default Home
