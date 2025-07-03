import React from 'react'

import { Paper } from '@mui/material'
import Typography from '@mui/material/Typography'
import { getNetworkIcon } from '@utils/network'

import { NetworkItemStyled } from './NetworkSelector.styled'
import { INetworkSelectorProps } from './NetworkSelector.types'

const NetworkItem = ({ name, chainId }: { name: string; chainId: number }) => (
  <NetworkItemStyled>
    {getNetworkIcon(chainId, { style: { width: 32, height: 32 } })}
    <Typography variant="button" color="text.secondary">
      {name}
    </Typography>
  </NetworkItemStyled>
)

const NetworkSelector: React.FC<INetworkSelectorProps> = ({ chains }) => {
  return (
    <Paper>
      {chains.map((chain) => (
        <NetworkItem
          key={chain?.id}
          name={chain.chainName}
          chainId={chain.id}
        />
      ))}
    </Paper>
  )
}

export default NetworkSelector
