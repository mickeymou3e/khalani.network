import React, { useEffect, useRef } from 'react'

import Typography from '@components/Typography'
import ChainSelectorPopover from '@components/selectors/ChainSelectorPopover'
import { IChain } from '@interfaces/core'

import ChainChip from '../ChainChip'
import { CustomizedChip } from '../ChainChip/ChainChip.styled'
import { CustomizedChainPicker } from './ChainPicker.styled'
import { IChainPickerProps } from './ChainPicker.types'

const ChainPicker: React.FC<IChainPickerProps> = (props) => {
  const { chains, selectedChains, buttonClickFn, chainSelectedFn } = props
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
  const open = Boolean(anchorEl)
  const pickerRef = useRef<HTMLDivElement | null>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePickerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pickerRef.current && pickerRef.current.contains(event.target as Node)) {
      setAnchorEl(event.currentTarget)
    }
  }

  const onChainSelect = (chain: IChain) => {
    chainSelectedFn(chain.id)
    setAnchorEl(null)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [pickerRef])

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    chainId: number,
  ) => {
    event.stopPropagation()
    buttonClickFn(chainId)
  }

  return (
    <CustomizedChainPicker
      elevation={3}
      onClick={handlePickerClick}
      ref={pickerRef}
    >
      {selectedChains.map((chain) => (
        <ChainChip
          key={chain.id}
          chainId={chain.id}
          chainName={chain.name}
          withCloseButton
          buttonClickFn={(event) => handleButtonClick(event, chain.id)}
        />
      ))}
      {selectedChains.length === 0 && (
        <CustomizedChip>
          <Typography
            text="Select a network"
            variant="button"
            color="text.secondary"
          />
        </CustomizedChip>
      )}
      <ChainSelectorPopover
        chains={chains ?? []}
        open={open}
        selectedChainId={0}
        anchorEl={anchorEl}
        handleChainSelect={onChainSelect}
        handleClose={handleClose}
      />
    </CustomizedChainPicker>
  )
}

export default ChainPicker
