import React from 'react'

import Button from '@components/buttons/Button'
import LabelLoader from '@components/loaders/LabelLoader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { bigNumberToString, formatWithMathematicalNotation } from '@utils/text'

import { messages } from './MaxAmountSelector.messages'
import { IMaxAmountSelectorProps } from './MaxAmountSelector.types'

const MaxAmountSelector: React.FC<IMaxAmountSelectorProps> = ({
  onMaxClick,
  maxAmount,
  decimals,
  disabled,
  isFetchingMaxAmount,
}) => (
  <>
    <Box display="flex" alignItems="center" pr={2}>
      <Typography
        variant="paragraphTiny"
        color={(theme) =>
          disabled ? theme.palette.text.darkGray : theme.palette.text.gray
        }
      >
        {messages.AVAILABLE}
      </Typography>
      <LabelLoader
        style={{
          width: isFetchingMaxAmount ? 35 : 'auto',
          marginLeft: 8,
        }}
        variant="paragraphTiny"
        color={(theme) =>
          disabled ? theme.palette.text.darkGray : theme.palette.text.gray
        }
        isFetching={isFetchingMaxAmount}
        tooltipText={
          isFetchingMaxAmount || decimals === undefined
            ? messages.LOADING
            : bigNumberToString(maxAmount, decimals)
        }
        text={
          isFetchingMaxAmount || decimals === undefined
            ? messages.LOADING
            : formatWithMathematicalNotation(
                Number(bigNumberToString(maxAmount, decimals)),
              )
        }
      />
    </Box>

    <Button
      sx={{
        textTransform: 'inherit',
      }}
      variant="outlined"
      size="tiny"
      disabled={isFetchingMaxAmount || disabled}
      text={messages.USE_MAX}
      onClick={onMaxClick}
    />
  </>
)

export default MaxAmountSelector
