import { Box } from '@mui/material'
import React from 'react'
import { IImagePanelProps } from './ImagePanel.types'

const ImagePanel: React.FC<IImagePanelProps> = ({ children, image }) => {
  const ratio = image.height / image.width
  return (
    <Box
      sx={{
        height: {
          xs: image.height,
          md: `calc(100vw*${ratio * 2})`,
          lg: `calc(100vw*${ratio})`,
        },
        width: '100%',

        backgroundSize: { xs: 'cover', lg: 'contain' },
        backgroundImage: `url(${image.src})`,
      }}
    >
      {children}
    </Box>
  )
}

export default ImagePanel
