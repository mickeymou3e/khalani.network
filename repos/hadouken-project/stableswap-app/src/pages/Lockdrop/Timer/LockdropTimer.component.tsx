import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { convertNumberToStringWithCommas } from '@hadouken-project/ui'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { MINUTE, formatDateWithZero } from '@utils/date'

import { MESSAGES } from '../Lockdrop.messages'
import { getCurrentLockdropDay } from './LockdropTimer.utils'

export const LockDropTimer: React.FC = () => {
  const dispatch = useDispatch()
  const lockDropTimeLeft = useSelector(lockdropSelectors.lockDropTimeLeft)
  const lockdropTotalValueLockedUSD = useSelector(
    lockdropSelectors.lockdropTotalValueLockedUSD,
  )

  const totalHDKReward = useSelector(lockdropSelectors.totalRewardHDK)

  const isLockDropTimeFinished = useSelector(
    lockdropSelectors.isLockDropTimeFinished,
  )

  const updateLockDropTimer = useCallback(() => {
    if (!isLockDropTimeFinished) {
      dispatch(lockDropActions.updateTimerRequest())
    }
  }, [dispatch, isLockDropTimeFinished])

  useEffect(() => {
    updateLockDropTimer()

    const countdownInterval = setInterval(
      updateLockDropTimer,
      (MINUTE / 2) * 1000,
    )

    return () => {
      clearInterval(countdownInterval)
    }
  }, [dispatch, updateLockDropTimer])

  if (!lockDropTimeLeft) return null

  return (
    <Paper>
      <Box>
        <Typography variant="h4Bold">Current status</Typography>
      </Box>
      <Box m={4}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          margin="0 auto"
          sx={(theme) => ({
            width: '200px',
            height: '200px',
            borderRadius: '100%',
            border: `10px solid ${theme.palette.tertiary.main}`,
            background: theme.palette.background.deepBlueDark,
          })}
        >
          <Typography variant="paragraphMedium">
            {MESSAGES.TIME_LEFT}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h3">
              {lockDropTimeLeft.days}
              <Typography
                component="span"
                color={(theme) => theme.palette.text.gray}
              >
                D
              </Typography>
              :
            </Typography>
            <Typography variant="h3">
              {formatDateWithZero(lockDropTimeLeft.hours)}
              <Typography
                component="span"
                color={(theme) => theme.palette.text.gray}
              >
                H
              </Typography>
              :
            </Typography>
            <Typography variant="h3">
              {formatDateWithZero(lockDropTimeLeft.minutes)}
              <Typography
                component="span"
                color={(theme) => theme.palette.text.gray}
              >
                M
              </Typography>
            </Typography>
          </Box>

          <Typography
            variant="paragraphTiny"
            sx={(theme) => ({
              color: theme.palette.text.gray,
            })}
          ></Typography>
        </Box>
      </Box>

      <Box mt={2} display="flex" alignItems="center" justifyContent="center">
        <Typography variant="paragraphSmall" fontWeight="bold">
          {MESSAGES.CURRENT_DAY}
        </Typography>
        <Typography
          ml={1}
          variant="h3"
          fontWeight="bold"
          color={(theme) => theme.palette.tertiary.main}
        >
          {getCurrentLockdropDay(lockDropTimeLeft.days)}
        </Typography>
      </Box>

      <Divider
        variant="fullWidth"
        sx={(theme) => ({
          borderBottomWidth: 1,
          background: theme.palette.background.backgroundBorder,
        })}
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-evenly"
        mt={3}
      >
        <Typography
          variant="paragraphSmall"
          fontWeight="bold"
          fontFamily="Sarpanch"
          sx={(theme) => ({ color: theme.palette.text.gray })}
        >
          {MESSAGES.TOTAL_VALUE_LOCKED}{' '}
          <Box component="span" color={(theme) => theme.palette.text.primary}>
            $
            {convertNumberToStringWithCommas(
              lockdropTotalValueLockedUSD?.toNumber() ?? 0,
              4,
              true,
            )}
          </Box>
        </Typography>
        <Typography
          variant="paragraphSmall"
          fontWeight="bold"
          fontFamily="Sarpanch"
          sx={(theme) => ({ color: theme.palette.text.gray })}
        >
          {MESSAGES.REWARD_POOL}{' '}
          <Box component="span" color={(theme) => theme.palette.text.primary}>
            {convertNumberToStringWithCommas(totalHDKReward.toNumber())} HDK
          </Box>
        </Typography>
      </Box>
    </Paper>
  )
}
