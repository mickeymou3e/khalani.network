import React from 'react'

import { Box, Button } from '@mui/material'

import InformBanner from '../InformBanner'
import { IChangeNetworkBannerProps } from './ChangeNetworkBanner.types'

const ChangeNetworkBanner: React.FC<IChangeNetworkBannerProps> = ({
  onChangeNetworkRequest,
}) => (
  <Box mb={1}>
    <InformBanner text="Please change network before proceeding">
      <Button
        onClick={onChangeNetworkRequest}
        sx={{
          ml: 2,
        }}
        variant="contained"
        color="primary"
        size="large"
      >
        Change network
      </Button>
    </InformBanner>
  </Box>
)

export default ChangeNetworkBanner
