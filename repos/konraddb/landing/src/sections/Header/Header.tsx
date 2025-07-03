import { Box, useMediaQuery } from '@mui/material'
import logo from '@images/logo.png'

const Header = () => {
  const isBigDesktop = useMediaQuery('(min-width:1921px)')

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          bgcolor: (theme) => theme.palette.primary.main,
          height: isBigDesktop ? '15vh' : '12vh',
          transition: 'top 0.5s',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 2,
        }}
      >
        <img
          src={logo}
          alt={logo}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
          }}
        />

        {/* <Box display="flex" gap={6} pr={'3vw'}>
          <Link
            href={config.blogUrl}
            target="_blank"
            underline="none"
            color="text.primary"
          >
            <Typography variant="subtitle1" text={'Blog'} />
          </Link>
          <Typography variant="subtitle1" text={'Intents U'} />
        </Box> */}
      </Box>
    </>
  )
}

export default Header
