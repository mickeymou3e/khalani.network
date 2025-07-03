import React from 'react'

import Slider from '@components/Slider'
import PrimaryButton from '@components/buttons/PrimaryButton'
import LabelLoader from '@components/loaders/LabelLoader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { formatWithCommas } from '@utils/text'

import { messages } from './MaxAmountSelector.messages'
import { IMaxAmountSelectorProps } from './MaxAmountSelector.types'

const MaxAmountSelector: React.FC<IMaxAmountSelectorProps> = ({
  onMaxClick,
  maxAmount,
  decimals,
  disabled = false,
  isFetchingMaxAmount,
  symbol,
  bottomText = messages.AVAILABLE,
  isSlider,
  onSliderChange,
  hideMaxButton = false,
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
    <Box display="flex" alignItems="center">
      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
        {bottomText}
      </Typography>
      <LabelLoader
        style={{
          width: isFetchingMaxAmount ? 35 : 'auto',
        }}
        variant="caption"
        fontWeight={700}
        color={(theme) => theme.palette.text.secondary}
        isFetching={isFetchingMaxAmount}
        text={
          isFetchingMaxAmount || decimals === undefined
            ? messages.LOADING
            : formatWithCommas(maxAmount, decimals)
        }
      />
      <Typography
        sx={{ ml: 0.5 }}
        variant="caption"
        fontWeight={700}
        color={(theme) => theme.palette.text.secondary}
      >
        {symbol}
      </Typography>
    </Box>

    {isSlider ? (
      <Box display="flex" width="50%">
        <Slider value={0} onChange={onSliderChange} />
      </Box>
    ) : (
      !hideMaxButton && (
        <PrimaryButton
          size="small"
          color="primary"
          variant="contained"
          disabled={isFetchingMaxAmount || disabled}
          onClick={onMaxClick}
        >
          {messages.BUTTON_LABEL}
        </PrimaryButton>
      )
    )}
  </Box>
)

export default MaxAmountSelector
