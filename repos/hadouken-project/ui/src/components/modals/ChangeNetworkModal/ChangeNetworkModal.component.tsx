import React, { useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import ButtonLayout from '@components/buttons/ButtonLayout'
import Modal from '@components/modals/Modal'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { testIds } from '@utils/dataTestIds'

import ModalHeader from '../ModalHeader'
import { messages } from './ChangeNetworkModal.messages'
import { IChangeNetworkModalProps } from './ChangeNetworkModal.types'

const ChangeWalletNetworkModal: React.FC<IChangeNetworkModalProps> = ({
  open,
  title = messages.TITLE,
  expectedNetwork,
  handleClose,
  changeNetwork,
}) => {
  const theme = useTheme()
  const [responseWaiting, setResponseWaiting] = useState(false)

  useEffect(() => {
    open ? setResponseWaiting(false) : null
  }, [open])

  const handleChangeWalletNetwork = () => {
    setResponseWaiting(true)
    changeNetwork?.()
  }
  return (
    <Modal open={open} handleClose={handleClose}>
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="start"
        flexDirection="column"
      >
        <ModalHeader title={title} />
        <Box
          height="100%"
          alignItems="start"
          display="flex"
          flexDirection="column"
        >
          <Box
            maxWidth={{ xs: 'none', md: 414 }}
            textAlign="start"
            paddingTop={2}
          >
            <Typography
              color={(theme) => theme.palette.text.gray}
              variant="caption"
            >
              {messages.TITLE_1}{' '}
              <b style={{ color: theme.palette.text.secondary }}>
                {expectedNetwork}
              </b>
              {'.'}
            </Typography>
          </Box>
        </Box>
        <ButtonLayout width="100%" mt={{ xs: 'auto', md: 3 }}>
          <Button
            text={messages.DISMISS}
            sx={{ width: '100%' }}
            onClick={handleClose}
            variant="outlined"
            size="medium"
          />
          <Button
            data-testid={testIds.SWITCH_NETWORK}
            sx={{ width: '100%' }}
            text={
              responseWaiting ? (
                <CircularProgress color="inherit" />
              ) : (
                messages.NETWORK_CHANGE
              )
            }
            onClick={handleChangeWalletNetwork}
            variant="contained"
            size="medium"
          />
        </ButtonLayout>
      </Box>
    </Modal>
  )
}

export default ChangeWalletNetworkModal
