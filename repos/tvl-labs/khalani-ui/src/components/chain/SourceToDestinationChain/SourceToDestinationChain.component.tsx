import React from 'react'

import Typography from '@components/Typography'
import { ArrowRightFilled } from '@components/icons'
import RedirectIcon from '@components/icons/business/Redirect'
import { IconButton, Stack } from '@mui/material'
import { getNetworkIcon } from '@utils/network'

import { ISourceToDestinationChainProps } from './SourceToDestinationChain.types'

const SourceToDestinationChain: React.FC<ISourceToDestinationChainProps> = (
  props,
) => {
  const {
    sourceChain,
    destinationChain,
    destinationChains,
    onSourceChainClick,
    onDestinationChainClick,
  } = props

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Stack direction="row" gap={0.5} alignItems="center">
        {getNetworkIcon(sourceChain.id, { style: { width: 16, height: 16 } })}
        <Typography
          text={sourceChain.chainName}
          variant="button"
          color="text.secondary"
        />
        {onSourceChainClick && (
          <IconButton
            sx={{ background: 'none', p: 0.5 }}
            onClick={onSourceChainClick}
          >
            <RedirectIcon fill="#000000" />
          </IconButton>
        )}
      </Stack>
      <ArrowRightFilled />
      {destinationChains && destinationChains.length > 1 ? (
        <Stack direction="row" gap={0.5}>
          {destinationChains.map((chain) => (
            <Stack direction="row" key={chain.id}>
              {getNetworkIcon(chain.id, { style: { width: 16, height: 16 } })}
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack direction="row" gap={0.5} alignItems="center">
          {getNetworkIcon(destinationChain.id, {
            style: { width: 16, height: 16 },
          })}
          <Typography
            text={destinationChain.chainName}
            variant="button"
            color="text.secondary"
          />
          {onDestinationChainClick && (
            <IconButton
              sx={{ background: 'none', p: 0.5 }}
              onClick={onDestinationChainClick}
            >
              <RedirectIcon fill="#000000" />
            </IconButton>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default SourceToDestinationChain
