import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { initializeStoreActions } from '@store/initializeStore/initializeStore.slice'
import { StoreDispatch } from '@store/store.types'

const InitializeSagaWrapper: React.FC = ({ children }) => {
  const dispatch = useDispatch<StoreDispatch>()

  useEffect(() => {
    dispatch(initializeStoreActions.initializeStoreRequest())
  }, [dispatch])

  return <>{children}</>
}

export default InitializeSagaWrapper
