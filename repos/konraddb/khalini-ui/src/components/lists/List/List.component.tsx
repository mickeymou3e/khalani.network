import React from 'react'

import { Box, ListItemButton, Typography } from '@mui/material'

import { IListItemComponent } from './List.types'

const ListItemDefaultComponent: React.FC<IListItemComponent> = ({
  text,
  description,
}) => {
  return (
    <ListItemButton>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Typography variant="h4Bold">{text}</Typography>
        <Typography variant="paragraphMedium">{description}</Typography>
      </Box>
    </ListItemButton>
  )
}

export default ListItemDefaultComponent
