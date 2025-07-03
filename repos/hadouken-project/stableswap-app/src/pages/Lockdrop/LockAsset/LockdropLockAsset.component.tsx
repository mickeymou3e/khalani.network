import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { isTriCrypto } from '@components/PoolTable/PoolTable.constants'
import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { address } from '@dataSource/graph/utils/formatters'
import {
  Button,
  HadoukenToken,
  LinkEnum,
  ToggleGroup,
  TokenModelBalanceWithIcon,
  TokenSelectorInput,
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
  Link,
} from '@hadouken-project/ui'
import { Box, Paper, Skeleton, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { BigDecimal } from '@utils/math'
import { formatNetworkName } from '@utils/network'

import { LOCK_DAYS_TOGGLES } from '../Lockdrop.constants'
import { MESSAGES } from '../Lockdrop.messages'

export const LockdropLockAsset: React.FC = () => {
  const dispatch = useDispatch()
  const tokens = useSelector(lockdropSelectors.phaseOneLockDropTokens)
  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const selectedLockToken = useSelector(
    lockdropSelectors.phaseOneSelectedLockToken,
  )

  const networkName = useSelector(networkSelectors.applicationNetworkName)

  const selectPoolModel = useSelector(poolsModelsSelector.selectByAddress)

  const lockTokenAmount = useSelector(lockdropSelectors.phaseOneLockAmount)

  const lockLength = useSelector(lockdropSelectors.phaseOneLockLength)

  const isLockInProgress = useSelector(
    lockdropSelectors.phaseOneIsLockInProgress,
  )
  const estimatedReward = useSelector(lockdropSelectors.phaseOneEstimatedReward)

  const boost = useSelector(lockdropSelectors.phaseOneLockBoost)

  const isLockDropTimeFinished = useSelector(
    lockdropSelectors.isLockDropTimeFinished,
  )

  const isCalculatingReward = useSelector(
    lockdropSelectors.phaseOneIsCalculatingReward,
  )

  const onTokenChange = (token: TokenModelBalanceWithIcon) => {
    if (
      selectedLockToken &&
      address(token.address) !== address(selectedLockToken.address)
    ) {
      dispatch(lockDropActions.phaseOneSetLockToken(token.address))
    }
  }

  const onAmountChange = (value: BigNumber | undefined) => {
    dispatch(
      lockDropActions.phaseOneLockAmountChangeRequest(
        value ? BigDecimal.from(value) : undefined,
      ),
    )
  }

  const onToggleChange = (value: string) => {
    dispatch(lockDropActions.phaseOneLockDurationChangeRequest(value))
  }

  const onLock = () => {
    dispatch(lockDropActions.phaseOneLockRequest())
  }

  const tokensWithIcon = useMemo(() => {
    return tokens.map((token) => {
      const Icon = getTokenIconWithChainComponent(token.symbol)

      const size = isTriCrypto(token.symbol) ? 64 : 32

      return {
        ...token,
        icon: <Icon width={size} height={size} />,
      }
    })
  }, [tokens])

  const selectedLockTokenWithIcon = tokensWithIcon.find(
    (token) =>
      address(token.address) === address(selectedLockToken?.address ?? ''),
  )

  return (
    <Paper>
      <Box>
        <Typography variant="h4Bold">Capital commitment</Typography>
        <Box mt={2}>
          <Typography
            variant="paragraphTiny"
            sx={(theme) => ({ color: theme.palette.text.gray })}
          >
            Lock your{' '}
            {tokens.map((token, index) => {
              const pool = selectPoolModel(token.address)
              const poolConfig = getPoolConfig(
                token.address,
                applicationChainId,
              )

              return (
                <>
                  <Link
                    key={token.address}
                    RouterLink={RouterLink}
                    linkType={LinkEnum.Internal}
                    url={`/${formatNetworkName(networkName)}/pools/${
                      pool?.id ?? ''
                    }`}
                    underline="none"
                    sx={{
                      transition: '.2s ease-in-out',
                      cursor: 'pointer',
                      color: (theme) => theme.palette.tertiary.main,
                      '&:hover': {
                        color: (theme) => theme.palette.tertiary.light,
                      },
                    }}
                  >
                    {poolConfig?.displayName ?? token.displayName}
                  </Link>
                  {index === 0 && <Box display="inline"> or </Box>}
                </>
              )
            })}
            , select your desired lock duration, and participate in Hadouken
            lock drop.
          </Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <TokenSelectorInput
          tokens={tokensWithIcon}
          amount={lockTokenAmount.toBigNumber()}
          selectedToken={selectedLockTokenWithIcon}
          onAmountChange={onAmountChange}
          onTokenChange={onTokenChange}
          splitToOneColumn
        />
      </Box>
      <Box mt={4}>
        <Typography variant="h4Bold">{MESSAGES.LOCK_IN_DAYS}</Typography>
        <Box mt={2}>
          <ToggleGroup
            sx={{ padding: 0 }}
            selected={lockLength.toString()}
            toggles={LOCK_DAYS_TOGGLES}
            onToggleChange={onToggleChange}
          />
        </Box>

        <Box
          sx={(theme) => ({
            background: theme.palette.background.deepBlue,
            padding: 2,
            marginTop: 2,
          })}
        >
          <Box>
            <Typography
              variant="paragraphTiny"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.LOCK_DAY_BOOST_WEIGHT}{' '}
              <Box
                component="span"
                color={(theme) => theme.palette.text.primary}
              >
                x{boost.dayBoost}
              </Box>
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="paragraphTiny"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.LOCK_BOOST_WEIGHT}{' '}
              <Box
                component="span"
                color={(theme) => theme.palette.text.primary}
              >
                x{boost.lockLengthBoost}
              </Box>
            </Typography>
          </Box>
          <Box
            mt={2}
            sx={(theme) => ({
              borderTop: `1px solid ${theme.palette.background.backgroundBorder}`,
            })}
          >
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="paragraphTiny"
                color={(theme) => theme.palette.text.gray}
              >
                {MESSAGES.LOCK_ESTIMATED_REWARD}
              </Typography>
              <Box display="flex" alignItems="center">
                {isCalculatingReward ? (
                  <Skeleton width="70px" height="30px" />
                ) : (
                  <Typography>
                    {convertNumberToStringWithCommas(
                      estimatedReward?.toNumber() ?? 0,
                      4,
                      true,
                    ) ?? 0}
                  </Typography>
                )}
                <Box ml={1} mt={0.5}>
                  <HadoukenToken />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mt={4} display="flex" justifyContent="end">
          <Button
            text={MESSAGES.LOCK}
            variant="contained"
            onClick={onLock}
            disabled={
              isLockDropTimeFinished ||
              isLockInProgress ||
              !lockTokenAmount?.gt(BigDecimal.from(0)) ||
              (selectedLockToken?.balance &&
                lockTokenAmount?.gt(
                  BigDecimal.from(
                    selectedLockToken?.balance,
                    selectedLockToken.decimals,
                  ),
                ))
            }
            isFetching={isLockInProgress}
          />
        </Box>
      </Box>
    </Paper>
  )
}
