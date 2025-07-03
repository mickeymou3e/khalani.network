import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useDispatch, useSelector } from 'react-redux'

import { Button, convertNumberToStringWithCommas } from '@hadouken-project/ui'
import { Box, Paper, Typography, useTheme } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'

import { MESSAGES } from '../Lockdrop.messages'

export const LockdropClaim: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const [startConfetti, setStartConfetti] = useState(false)

  const totalHDKEarned = useSelector(lockdropSelectors.totalUserHdkToClaim)
  const userLocks = useSelector(lockdropSelectors.userLocksTransactions)
  const isClaimInProgress = useSelector(lockdropSelectors.isClaimHDKInProgress)
  const isClaimSuccessful = useSelector(lockdropSelectors.isClaimSuccessful)

  const userAlreadyCollectedHDKTokens = useSelector(
    lockdropSelectors.phaseTwoUserAlreadyCollectedHDKTokens,
  )

  const onClaim = () => {
    dispatch(lockDropActions.claimHDKRequest())
  }

  useEffect(() => {
    if (isClaimSuccessful) {
      setStartConfetti(true)
      setTimeout(() => {
        dispatch(lockDropActions.clearClaimSuccessfulFlag())
      }, 5000)
    }
  }, [dispatch, isClaimSuccessful])

  const hideClaimSection = userLocks.length === 0

  if (hideClaimSection) return null

  return (
    <Box>
      <Box position="fixed" top={0} left={0}>
        <Confetti
          run={startConfetti}
          numberOfPieces={400}
          tweenDuration={2000}
          recycle={isClaimSuccessful}
          colors={[
            theme.palette.tertiary.main,
            theme.palette.tertiary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.text.secondary,
          ]}
          onConfettiComplete={() => {
            setStartConfetti(false)
          }}
        />
      </Box>

      <Paper sx={{ marginBottom: hideClaimSection ? 0 : 2 }}>
        <Box>
          <Typography variant="h4Bold">{MESSAGES.HDK_EARNED}</Typography>
        </Box>
        <Box mt={2}>
          <Typography>
            {convertNumberToStringWithCommas(totalHDKEarned.toNumber())} HDK
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.HDK_EARNED_DESCRIPTION}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            text={
              userAlreadyCollectedHDKTokens ? MESSAGES.CLAIMED : MESSAGES.CLAIM
            }
            disabled={isClaimInProgress || userAlreadyCollectedHDKTokens}
            isFetching={isClaimInProgress}
            onClick={onClaim}
          />
        </Box>
      </Paper>
    </Box>
  )
}
