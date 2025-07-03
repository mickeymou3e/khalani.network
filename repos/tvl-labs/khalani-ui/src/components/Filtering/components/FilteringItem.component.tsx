import React from 'react'

import { CloseIcon } from '@components/icons'
import { Button, Paper, Typography } from '@mui/material'
import { getTokenComponent } from '@utils/icons'
import { getNetworkIcon } from '@utils/network'

import { FilteringType } from '../Filtering.types'
import { CustomizedFilteringItem } from './FilteringItem.styled'
import { IFilteringItemProps } from './FilteringItem.types'

const FilteringItem: React.FC<IFilteringItemProps> = (props) => {
  const { type, value, onCloseClick, onFilterClick } = props

  const iconParams = { width: 28, height: 28 }

  const label =
    type === FilteringType.Network ? 'Filter by network' : 'Filter by token'

  return (
    <CustomizedFilteringItem elevation={2}>
      <Button
        onClick={onFilterClick}
        sx={{
          px: 1,
          py: value ? 0.25 : 0.875,
        }}
      >
        <Typography variant="button" color="text.secondary">
          {label}
        </Typography>
      </Button>

      {value && (
        <Paper
          elevation={3}
          sx={{
            p: 0.25,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 3,
            gap: 0.5,
          }}
        >
          {type === FilteringType.Network
            ? getNetworkIcon(parseInt(value, 16), {
                style: iconParams,
              })
            : getTokenComponent(value, iconParams)}

          <CloseIcon style={{ width: 21, height: 22 }} onClick={onCloseClick} />
        </Paper>
      )}
    </CustomizedFilteringItem>
  )
}

export default FilteringItem
