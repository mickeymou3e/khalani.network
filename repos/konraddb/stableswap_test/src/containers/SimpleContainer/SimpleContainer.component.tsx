import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'
import { StoreDispatch } from '@store/store.types'

export const DATA_TESTID = {
  button: 'test-button',
  label: 'test-label',
  text: 'test-text',
}

const SimpleContainer: React.FC = () => {
  const [init, setInit] = useState(false)
  const [text, setText] = useState<string | null>(null)
  const dispatch = useDispatch<StoreDispatch>()

  const latestBlock = useSelector(networkSelectors.latestBlock)

  // On INIT effect
  useEffect(() => {
    setInit(true)
  }, [])

  // React on redux store change effect
  useEffect(() => {
    if (init) {
      setText(String(latestBlock))
    }
  }, [latestBlock, init])

  // Perform redux action
  const onClick = () => {
    dispatch(networkActions.updateLatestBlock(777))
  }

  return (
    <>
      <Button onClick={onClick} data-testid={DATA_TESTID.button}>
        action
      </Button>
      <Typography data-testid={DATA_TESTID.label}>{latestBlock}</Typography>
      <Typography data-testid={DATA_TESTID.text}>{text}</Typography>
    </>
  )
}

export default SimpleContainer
