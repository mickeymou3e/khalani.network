import { Typography } from '@mui/material'
import React from 'react'

import { IParagraphProps } from './Paragraph.types'

const Paragraph: React.FC<IParagraphProps> = ({ title, description }) => {
  return (
    <>
      <Typography variant="h1" color={(theme) => theme.palette.text.quaternary}>
        {title}
      </Typography>
      {description && (
        <Typography
          sx={{ pt: 3 }}
          variant="h3"
          color={(theme) => theme.palette.text.primary}
        >
          {description}
        </Typography>
      )}
    </>
  )
}

export default Paragraph
