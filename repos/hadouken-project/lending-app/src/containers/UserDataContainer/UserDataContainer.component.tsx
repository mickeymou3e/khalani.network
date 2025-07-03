import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { userDataActions } from '@store/userData/userData.slice'
import {
  useGetUserTotalBorrow,
  useGetUserTotalCollateral,
} from '@utils/math/math.hook'

const UserDataContainer: React.FC = () => {
  const dispatch = useDispatch()

  const totalDeposit = useGetUserTotalCollateral(true)
  const totalCollateral = useGetUserTotalCollateral()
  const totalBorrow = useGetUserTotalBorrow()

  useEffect(() => {
    if (
      totalDeposit !== undefined &&
      totalCollateral !== undefined &&
      totalBorrow !== undefined
    ) {
      dispatch(
        userDataActions.updateUserBalances({
          totalDeposit,
          totalCollateral,
          totalBorrow,
        }),
      )
    }
  }, [dispatch, totalDeposit, totalCollateral, totalBorrow])

  return <></>
}

export default UserDataContainer
