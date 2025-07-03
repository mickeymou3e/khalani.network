import React from 'react'

import { Box, Button } from '@mui/material'

import InformBanner from '../InformBanner'
import { IChangeNetworkBannerProps } from './ChangeNetworkBanner.types'

const ChangeNetworkBanner: React.FC<IChangeNetworkBannerProps> = ({
  onChangeNetworkRequest,
}) => (
  <Box>
    <InformBanner text="Please change network before proceeding">
      <Button
        onClick={onChangeNetworkRequest}
        sx={{
          ml: 2,
        }}
        variant="outlined"
        color="secondary"
        size="small"
      >
        Change network
      </Button>
    </InformBanner>
  </Box>
)

export default ChangeNetworkBanner
