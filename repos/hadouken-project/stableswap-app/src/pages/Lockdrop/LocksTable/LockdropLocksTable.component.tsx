import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Table, convertNumberToStringWithCommas } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'

import { MESSAGES } from '../Lockdrop.messages'
import { getRows, COLUMNS } from './Lockdrop.table'

export const LockdropLocks: React.FC = () => {
  const dispatch = useDispatch()
  const applicationChainId = useSelector(networkSelectors.applicationChainId)
  const lockDrops = useSelector(lockdropSelectors.userLocksTransactions)

  const lockDropCurrentPhase = useSelector(
    lockdropSelectors.lockdropCurrentPhase,
  )
  const currentIdForUnlock = useSelector(
    lockdropSelectors.phaseThreeCurrentIdForUnlock,
  )

  const totalUserCapitalLockedInUSD = useSelector(
    lockdropSelectors.totalUserCapitalLockInUSD,
  )

  const onUnlockAsset = (lockId: number) => {
    dispatch(lockDropActions.phaseThreeUnlockRequest(lockId))
  }

  const selectPoolModel = useSelector(poolsModelsSelector.selectByAddress)
  const networkName = useSelector(networkSelectors.applicationNetworkName)

  const lockdropRows = getRows(
    lockDrops,
    applicationChainId,
    lockDropCurrentPhase,
    onUnlockAsset,
    currentIdForUnlock,
    selectPoolModel,
    networkName,
  )

  return (
    <Paper>
      {lockdropRows.length === 0 ? (
        <Typography
          color={(theme) => theme.palette.text.secondary}
          align="center"
          variant="paragraphBig"
        >
          {MESSAGES.NO_RESULTS}
        </Typography>
      ) : (
        <Box>
          <Box
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4Bold">{MESSAGES.CAPITAL_LOCKED}</Typography>
            <Typography sx={{ fontWeight: 700 }}>
              $
              {convertNumberToStringWithCommas(
                totalUserCapitalLockedInUSD.toNumber(),
                4,
              )}
            </Typography>
          </Box>
          <Table columns={COLUMNS} rows={lockdropRows} />
        </Box>
      )}
    </Paper>
  )
}
