import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import {
  Button,
  Link,
  LinkEnum,
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
} from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { BigDecimal } from '@utils/math'
import { config, formatNetworkName, getNetworkName } from '@utils/network'

import { MESSAGES } from '../Lockdrop.messages'
import { useLpTokensPercentage } from './LpVestingPercentages.hook'

export const LpVesting: React.FC = () => {
  const dispatch = useDispatch()
  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const phaseThreePoolId = config.lockDropTokens[applicationChainId].Pool

  const selectPoolModel = useSelector(poolsModelsSelector.selectById)

  const pool = selectPoolModel(phaseThreePoolId)

  const poolTokensIcons = pool
    ? pool.depositTokens.map((token) => {
        const Icon = getTokenIconWithChainComponent(token.symbol)
        return (
          <Box key={token.address}>
            <Icon height={14} width={14} />
          </Box>
        )
      })
    : null

  const userTotalLpAvailableToClaim = useSelector(
    lockdropSelectors.phaseThreeTotalUserLpTokensAvailableToClaim,
  )

  const daysLeft = useSelector(lockdropSelectors.phaseThreeDaysLeft)

  const claimedAmount = useSelector(
    lockdropSelectors.phaseThreeUserLpTokensClaimed,
  )

  const currentAvailableLpTokens = useSelector(
    lockdropSelectors.phaseThreeCurrentAvailableLpTokens,
  )

  const isClaimInProgress = useSelector(
    lockdropSelectors.phaseThreeIsClaimInProgress,
  )

  const claimedPercentage = useLpTokensPercentage(
    claimedAmount,
    userTotalLpAvailableToClaim,
  )
  const availablePercentage = useLpTokensPercentage(
    currentAvailableLpTokens,
    userTotalLpAvailableToClaim,
  )

  const restPercentage =
    100 - Number(claimedPercentage) - Number(availablePercentage)

  const onClaimLpTokens = () => {
    dispatch(lockDropActions.phaseThreeClaimLpTokensRequest())
  }

  const userClaimedAllLpTokens = claimedAmount
    .toBigNumber()
    .eq(userTotalLpAvailableToClaim.toBigNumber())

  if (!userTotalLpAvailableToClaim.gt(BigDecimal.from(0))) return null

  return (
    <Paper sx={{ marginBottom: 4 }}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4Bold">{MESSAGES.LP_VESTING}</Typography>

        <Box marginLeft="auto">
          <Link
            RouterLink={RouterLink}
            linkType={LinkEnum.Internal}
            url={`/${formatNetworkName(
              getNetworkName(applicationChainId),
            )}/pools/${phaseThreePoolId}`}
          >
            <Typography
              sx={{ textDecoration: 'underline' }}
              color="textPrimary"
              variant="paragraphTiny"
            >
              View Pool
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography
          variant="paragraphTiny"
          color={(theme) => theme.palette.text.gray}
        >
          {MESSAGES.LP_VESTING_DESCRIPTION}
        </Typography>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography
              variant="paragraphTiny"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.TOTAL_TO_CLAIM}
            </Typography>
          </Box>
          <Box pt={0.5} display="flex" alignItems="center">
            <Typography>
              {convertNumberToStringWithCommas(
                userTotalLpAvailableToClaim.toNumber(),
                6,
                true,
              )}
            </Typography>
            <Box display="flex" alignItems="center" ml={0.5}>
              {poolTokensIcons}
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.TIME_LEFT}
          </Typography>

          <Box pt={0.5}>
            <Typography variant="paragraphSmall">{daysLeft} Days</Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              width={10}
              height={10}
              borderRadius="2px"
              bgcolor={(theme) => theme.palette.success.light}
            />
            <Typography
              variant="paragraphTiny"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.CLAIMED}
            </Typography>
          </Box>
          <Box pt={0.5} display="flex" alignItems="center">
            <Typography>
              {convertNumberToStringWithCommas(
                claimedAmount.toNumber(),
                6,
                true,
              )}
            </Typography>
            <Box display="flex" alignItems="center" ml={0.5}>
              {poolTokensIcons}
            </Box>
          </Box>
        </Box>

        <Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              width={10}
              height={10}
              borderRadius="2px"
              bgcolor={(theme) => theme.palette.warning.light}
            />
            <Typography
              variant="paragraphTiny"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.AVAILABLE_TO_CLAIM}
            </Typography>
          </Box>
          <Box
            pt={0.5}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Typography>
              {convertNumberToStringWithCommas(
                currentAvailableLpTokens.toNumber(),
                6,
                true,
              )}
            </Typography>
            <Box display="flex" alignItems="center" ml={0.5}>
              {poolTokensIcons}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={2} width="100%">
        <Box display="flex" width="100%">
          <Box
            bgcolor={(theme) => theme.palette.success.light}
            height={8}
            width={`${claimedPercentage}%`}
          />
          <Box
            bgcolor={(theme) => theme.palette.warning.light}
            height={8}
            width={`${availablePercentage}%`}
          />
          <Box
            bgcolor={(theme) => theme.palette.common.black}
            height={8}
            width={`${restPercentage}%`}
          />
        </Box>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            text={userClaimedAllLpTokens ? MESSAGES.CLAIMED : MESSAGES.CLAIM}
            disabled={
              isClaimInProgress ||
              !currentAvailableLpTokens.gt(BigDecimal.from(0)) ||
              userClaimedAllLpTokens
            }
            isFetching={isClaimInProgress}
            variant="contained"
            onClick={onClaimLpTokens}
          />
        </Box>
      </Box>
    </Paper>
  )
}
