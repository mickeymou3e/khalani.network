import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { isTriCrypto } from '@components/PoolTable/PoolTable.constants'
import { getChainConfig } from '@config'
import { Network } from '@constants/Networks'
import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import {
  Button,
  ExternalLink,
  HadoukenToken,
  IColumn,
  IRow,
  Link,
  LinkEnum,
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
  getTransactionLabel,
} from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'
import { LockDrop, LockdropPhase } from '@store/lockDrop/lockDrop.types'
import { IPoolModel } from '@store/pool/selectors/models/types'
import { DAY, formatLockedDistance } from '@utils/date'
import { formatNetworkName } from '@utils/network'

import { LOCK_LENGTH_DAYS } from '../Lockdrop.constants'
import { MESSAGES } from '../Lockdrop.messages'

const LOCKDROP_TABLE_COLUMNS = {
  ASSET: 'Asset',
  AMOUNT: 'Amount',
  TIME_TO_UNLOCK: 'Time to unlock',
  REWARD: 'Reward',
  TXN: 'Transaction',
}

export const COLUMNS: IColumn[] = [
  {
    name: LOCKDROP_TABLE_COLUMNS.ASSET,
    width: '25%',
    isSortable: false,
    value: LOCKDROP_TABLE_COLUMNS.ASSET,
  },
  {
    name: LOCKDROP_TABLE_COLUMNS.AMOUNT,
    width: '25%',
    isSortable: false,
    value: LOCKDROP_TABLE_COLUMNS.AMOUNT,
  },
  {
    name: LOCKDROP_TABLE_COLUMNS.TIME_TO_UNLOCK,
    width: '20%',
    isSortable: false,
    value: LOCKDROP_TABLE_COLUMNS.TIME_TO_UNLOCK,
  },
  {
    name: LOCKDROP_TABLE_COLUMNS.REWARD,
    width: '20%',
    isSortable: false,
    value: LOCKDROP_TABLE_COLUMNS.REWARD,
  },
  {
    name: LOCKDROP_TABLE_COLUMNS.TXN,
    width: '10%',
    isSortable: false,
    value: LOCKDROP_TABLE_COLUMNS.TXN,
  },
]

export const getRows = (
  lockdrops: LockDrop[],
  chainId: Network,
  currentPhase: LockdropPhase | undefined,
  onUnlockAsset: (lockId: number) => void,
  currentIdForUnlock: number | undefined,
  selectPoolModel: (poolAddress: string) => IPoolModel | undefined,
  networkName: string,
): IRow[] => {
  const rows: IRow[] = [...lockdrops]
    .sort((tx1, tx2) => {
      return tx2.creationDate.getTime() - tx1.creationDate.getTime()
    })
    .map(
      ({
        id,
        creationDate,
        lockLength,
        tokenAddress,
        isLocked,
        reward,
        transaction,
        lockInUSD,
        lockId,
        amount,
      }) => {
        //* NOTE: only 3crypto and HUSD
        const token = getPoolConfig(tokenAddress, chainId)

        const pool = selectPoolModel(tokenAddress)

        const TokenIcon = getTokenIconWithChainComponent(token?.symbol ?? '')

        const lockDays = LOCK_LENGTH_DAYS[lockLength]

        const lockedDuration = new Date(
          creationDate.getTime() + lockDays * DAY * 1000,
        ).getTime()

        const currentDate = new Date().getTime()

        const isLockPeriodExpired = currentDate >= lockedDuration

        const isFirstPhase =
          currentPhase === LockdropPhase.One ||
          currentPhase === LockdropPhase.InterludiumOne

        const rewardHdk = convertNumberToStringWithCommas(
          reward.toNumber(),
          2,
          false,
        )

        const isTriCryptoToken = isTriCrypto(token?.symbol ?? '')

        const isUnlockInProgress = currentIdForUnlock === Number(lockId)

        const linkToPool = `/${formatNetworkName(networkName)}/pools/${
          pool?.id ?? ''
        }`

        return {
          id,
          cells: {
            [LOCKDROP_TABLE_COLUMNS.ASSET]: {
              value: (
                <Link
                  RouterLink={RouterLink}
                  linkType={LinkEnum.Internal}
                  url={linkToPool}
                  underline="none"
                  sx={{
                    transition: '.2s ease-in-out',
                    cursor: 'pointer',
                    color: (theme) => theme.palette.text.primary,
                    '&:hover': {
                      color: (theme) => theme.palette.text.secondary,
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <TokenIcon
                      width={isTriCryptoToken ? 64 : 34}
                      height={isTriCryptoToken ? 64 : 34}
                    />
                    <Typography variant="paragraphSmall" ml={2}>
                      {token?.displayName}
                    </Typography>
                  </Box>
                </Link>
              ),
            },
            [LOCKDROP_TABLE_COLUMNS.AMOUNT]: {
              value: (
                <Typography variant="paragraphSmall">
                  {convertNumberToStringWithCommas(amount.toNumber(), 4, false)}{' '}
                  &#40;$
                  {convertNumberToStringWithCommas(
                    lockInUSD.toNumber(),
                    4,
                    false,
                  )}
                  &#41;
                </Typography>
              ),
            },
            [LOCKDROP_TABLE_COLUMNS.TIME_TO_UNLOCK]: {
              value: (
                <Box>
                  {!isLockPeriodExpired && (
                    <Typography variant="paragraphSmall">
                      {formatLockedDistance(currentDate, lockedDuration)}
                    </Typography>
                  )}

                  {isLockPeriodExpired && isLocked && (
                    <Button
                      variant="contained"
                      size="tiny"
                      text={MESSAGES.UNLOCK}
                      isFetching={isUnlockInProgress}
                      disabled={isUnlockInProgress}
                      onClick={() => {
                        onUnlockAsset(Number(lockId))
                      }}
                    />
                  )}

                  {!isLocked && (
                    <Typography variant="paragraphSmall">
                      {MESSAGES.UNLOCKED}
                    </Typography>
                  )}
                </Box>
              ),
            },
            [LOCKDROP_TABLE_COLUMNS.REWARD]: {
              value: (
                <Box>
                  {isFirstPhase ? (
                    <Typography
                      variant="paragraphSmall"
                      color={(theme) => theme.palette.text.gray}
                    >
                      {MESSAGES.NOT_AVAILABLE_IN_THIS_PHASE}
                    </Typography>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <Typography variant="paragraphSmall">
                        {rewardHdk}
                      </Typography>
                      <Box ml={1} mt={0.5}>
                        <HadoukenToken />
                      </Box>
                    </Box>
                  )}
                </Box>
              ),
            },
            [LOCKDROP_TABLE_COLUMNS.TXN]: {
              value: (
                <Box display="flex" alignItems="center">
                  <Typography variant="paragraphSmall" mr={1}>
                    {getTransactionLabel(transaction)}
                  </Typography>
                  <ExternalLink
                    height={14}
                    width={16}
                    destination={getChainConfig(chainId).explorerUrl.godwoken}
                    hash={transaction}
                    type="tx"
                  />
                </Box>
              ),
            },
          },
        }
      },
    )

  return rows
}
