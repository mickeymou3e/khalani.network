import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { IChildren } from '@interfaces/children'
import { StoreDispatch } from '@store/store.types'

import { initializeStoreActions } from '../../store'

const InitializeSagaWrapper: React.FC<IChildren> = ({ children }) => {
  const dispatch = useDispatch<StoreDispatch>()

  useEffect(() => {
    dispatch(initializeStoreActions.initializeStoreRequest())
  }, [dispatch])

  return <>{children}</>
}

export default InitializeSagaWrapper
