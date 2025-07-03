import React, { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import Button from '@components/buttons/Button'
import { CloseIcon } from '@components/icons'
import BigNumberInput from '@components/inputs/BigNumberInput'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { getDefaultValue } from './RadioButtonModal.constants'
import { messages } from './RadioButtonModal.messages'
import { IRadioButtonModalProps } from './RadioButtonModal.types'

const RadioButtonModal: React.FC<IRadioButtonModalProps> = ({
  open,
  title = messages.TITLE,
  description = messages.DESCRIPTION,
  handleClose,
  customizedAmount,
  onCustomizedAmountChange,
  decimals = 4,
  maxValue,
}) => {
  const [inputValue, setInputValue] = useState<BigNumber | undefined>(
    customizedAmount ?? getDefaultValue(decimals),
  )

  useEffect(() => {
    if (open && customizedAmount) {
      setInputValue(customizedAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onChange = (value: BigNumber | undefined) => {
    setInputValue(value)
  }

  const onInputValueConfirm = () => {
    onCustomizedAmountChange(inputValue)
    handleClose()
  }

  return (
    <Modal open={open} handleClose={handleClose}>
      <Box display="flex" justifyContent="end" alignItems="center">
        <CloseIcon onClick={handleClose} />
      </Box>
      <ModalHeader title={title} />
      <Box
        alignItems="start"
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Box
          paddingTop={2}
          paddingBottom={3}
          maxWidth={{ xs: 'none', md: 380 }}
        >
          <Typography
            textAlign="start"
            variant="caption"
            color={(theme) => theme.palette.text.gray}
          >
            {description}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" width="100%">
          <Box flexBasis="70%" mr={1}>
            <BigNumberInput
              decimals={decimals}
              value={inputValue}
              onChange={onChange}
              maxAmount={maxValue}
            />
          </Box>
          <Box flex="30%">
            <Button
              disabled={!inputValue || (inputValue && inputValue?.eq(0))}
              text="Confirm"
              variant="contained"
              size="large"
              sx={{ width: '100%' }}
              onClick={onInputValueConfirm}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
export default RadioButtonModal
