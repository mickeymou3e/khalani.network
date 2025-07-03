import React, { useState } from 'react'

import TokenPaper from '@components/TokenPaper/TokenPaper.component'
import { ALL_TOKENS_ID } from '@constants/Tokens'
import { getTokenIconComponent } from '@hadouken-project/ui'
import { Box, Grid } from '@mui/material'

import { ISvg, ITokenPaperListProps } from './TokenPaperList.types'

const TokenPaperList: React.FC<ITokenPaperListProps> = ({
  selectedTokenId,
  operationName,
  description,
  percentage,
  tokens,
  onChange,
}) => {
  const [selected, setSelected] = useState(
    tokens.length > 0 ? tokens[0].id : null,
  )

  const tokensWithIcon = tokens.map((token) => ({
    id: token.id,
    name: token.symbol,
    icon: getTokenIconComponent(token.symbol),
  }))
  const allTokensGridSize = tokensWithIcon.length <= 2 ? 12 : 6

  const tokensWithIconAndAllVariant = [
    ...tokensWithIcon,
    {
      id: ALL_TOKENS_ID,
      name: ALL_TOKENS_ID,
      icon: (props: ISvg) => (
        <>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            width={4}
            paddingTop={1}
            marginRight="30px"
          >
            {tokensWithIcon.map((token) => {
              const Icon = token.icon
              return (
                <Grid
                  key={token.id}
                  item
                  xs={allTokensGridSize}
                  style={{ padding: '5px', background: 'none' }}
                >
                  <Icon {...props} />
                </Grid>
              )
            })}
          </Box>
        </>
      ),
    },
  ]
  const onSelectionChange = (id: string): void => {
    setSelected(id)
    onChange?.(id)
  }

  return (
    <Grid container spacing={1}>
      {tokensWithIconAndAllVariant.map((token) => (
        <Grid item key={token.id} xs={6} md={4}>
          <TokenPaper
            operationName={operationName}
            description={description}
            token={token}
            percentage={percentage}
            selected={
              selectedTokenId !== undefined
                ? selectedTokenId === token.id
                : token.id === selected
            }
            onClick={() => onSelectionChange(token.id)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default TokenPaperList
