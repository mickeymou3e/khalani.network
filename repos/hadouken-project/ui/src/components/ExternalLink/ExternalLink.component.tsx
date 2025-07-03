import React from 'react'

import { styled, useTheme, lighten } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

import { ArrowTopRightIcon } from '../icons/business/ArrowTopRight'
import { IExternalLinkProps } from './ExternalLink.types'

const StyledArrowTopRightIcon = styled(ArrowTopRightIcon)(({ fill }) => ({
  '&:hover': {
    '& > path': {
      stroke: fill ? lighten(fill, 0.2) : 'inherit',
    },
  },
}))

const ExternalLink: React.FC<IExternalLinkProps> = ({
  destination,
  hash,
  type,
  fill,
  width = 12,
  height = 12,
}) => {
  const theme = useTheme()
  return (
    <Box>
      <Link target="_blank" href={`${destination}/${type}/${hash}`}>
        <StyledArrowTopRightIcon
          fill={fill ? fill : theme.palette.text.secondary}
          style={{ height, width }}
        />
      </Link>
    </Box>
  )
}

export default ExternalLink
