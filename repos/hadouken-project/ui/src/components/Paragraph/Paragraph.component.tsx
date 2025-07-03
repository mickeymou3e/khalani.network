import React from 'react'

import { Box, Typography } from '@mui/material'

import { IParagraphProps } from './Paragraph.types'

const Paragraph: React.FC<IParagraphProps> = ({
  title,
  description,
  ...rest
}) => {
  return (
    <Box
      textAlign="left"
      display="flex"
      flexDirection="column"
      gap={1}
      {...rest}
    >
      <Typography variant="h4Bold" color="textPrimary">
        {title}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          color={(theme) => theme.palette.text.secondary}
        >
          {description}
        </Typography>
      )}
    </Box>
  )
}

export default Paragraph
