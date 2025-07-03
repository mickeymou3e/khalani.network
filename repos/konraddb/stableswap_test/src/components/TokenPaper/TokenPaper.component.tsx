import React from 'react'

import { ALL_TOKENS_ID } from '@constants/Tokens'
import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { ITokenPaperProps } from './TokenPaper.types'

const TokenPaper: React.FC<ITokenPaperProps> = ({
  operationName,
  description,
  percentage,
  token,
  selected,
  onClick,
}) => {
  const { spacing, palette } = useTheme()
  const TokenIcon = token.icon

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={0.5}
      paddingTop={2.375}
      paddingBottom={0.5}
      marginBottom={1}
      borderRadius="6px"
      width="100%"
      sx={{
        background: (theme) =>
          selected ? theme.palette.text.secondary : 'none',
        color: (theme) =>
          selected
            ? theme.palette.common.black
            : alpha(theme.palette.text.secondary, 0.7),
        border: (theme) =>
          `1px solid ${alpha(theme.palette.text.secondary, 0.3)}`,
        cursor: 'pointer',
        '&:hover': {
          color: (theme) => theme.palette.text.secondary,
          backgroundColor: (theme) => alpha(theme.palette.text.secondary, 0.3),
        },
      }}
      onClick={onClick}
    >
      <Box
        padding={spacing(0.25)}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
      >
        <TokenIcon
          height={token.name === ALL_TOKENS_ID ? 36 : 60}
          width={token.name === ALL_TOKENS_ID ? 36 : 60}
          fill={selected ? palette.action.active : palette.primary.main}
        />
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography
            variant="overline"
            style={{
              color: selected ? palette.action.selected : palette.common.white,
              fontWeight: 900,
            }}
          >
            {operationName}
          </Typography>
          <Typography
            variant="h3"
            style={{
              marginTop: spacing(1),
              fontSize: '36px',
              fontWeight: 900,
              color: selected ? palette.action.selected : palette.common.white,
            }}
          >{`${percentage}% `}</Typography>
          <Typography
            variant="paragraphSmall"
            style={{
              fontWeight: 400,
              color: selected ? palette.action.selected : palette.primary.main,
              paddingTop: '10px',
              fontSize: '14px',
            }}
          >
            {description}
            &nbsp;
            {<b style={{ textTransform: 'uppercase' }}>{token.name}</b>}
            &nbsp;
            {'asset'}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TokenPaper
