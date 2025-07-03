import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ShowUserLPSharesModal } from '@components/modals/ShowUserLPSharesModal/ShowUserLPSharesModal.component'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { StoreDispatch } from '@store/store.types'
import { userSharesActions } from '@store/userShares/userShares.slice'

import { IShowUserLPSharesProps } from './ShowUserLPShares.types'

export const ShowUserLPShares: React.FC<IShowUserLPSharesProps> = ({
  children,
  poolName,
}) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch<StoreDispatch>()

  const selectByName = useSelector(poolSelectors.selectByName)
  const pool = selectByName(poolName)

  const handleClick = useCallback(() => {
    if (pool) {
      setOpen(true)
      dispatch(userSharesActions.updateUserSharesRequest(pool.id))
    }
  }, [pool, dispatch])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {children({ onClick: handleClick })}
      {pool && (
        <ShowUserLPSharesModal
          open={open}
          handleClose={handleClose}
          poolId={pool.id}
        />
      )}
    </>
  )
}
