import React, { useState } from 'react'

import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import { ISelectorItem, ISelectorProps } from './Selector.types'
import SelectorDialog from './SelectorDialog/SelectorDialog.component'

const Selector: React.FC<ISelectorProps> = ({
  title,
  onSelect,
  children,
  items,
  selectedItem,
  itemRenderer,
  ...rest
}) => {
  const handleItemSelect = (selectedItem: ISelectorItem) => {
    const item = items.find((item) => item.id === selectedItem.id)
    if (item) {
      onSelect?.(item)
    }
    handleClose()
  }

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <SelectorDialog
        open={open}
        title={title}
        handleClose={handleClose}
        items={items}
        onSelect={handleItemSelect}
        selectedItem={selectedItem}
        itemRenderer={itemRenderer}
      />
      <ToggleButtonGroup
        exclusive
        onChange={handleClickOpen}
        value={open && selectedItem}
        {...rest}
      >
        <ToggleButton value={selectedItem}>{children}</ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}

export default Selector
