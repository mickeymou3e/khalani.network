import React from 'react'

import { CloseIcon } from '@components/icons'
import ListItemDefaultComponent from '@components/lists/List/List.component'
import {
  Box,
  Dialog,
  List,
  ListItem,
  Paper,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'

import { messages } from './SelectorDialog.messages'
import { ISelectorDialog } from './SelectorDialog.types'

const SelectorDialog: React.FC<ISelectorDialog> = ({
  open,
  title = messages.HEADER,
  items,
  itemRenderer,
  handleClose,
  onSelect,
  selectedItem,
}) => {
  const upSM = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Dialog
      fullScreen={upSM ? false : true}
      PaperComponent={(props) => (
        <Paper
          {...props}
          sx={{ padding: 2, minWidth: upSM ? 352 : undefined }}
        />
      )}
      open={open}
      onClose={handleClose}
    >
      <Box width="100%">
        <Box sx={{ paddingBottom: 1 }}>
          <Box display="flex">
            <CloseIcon
              onClick={handleClose}
              fill={'red'}
              style={{
                cursor: 'pointer',
                marginLeft: 'auto',
                width: 14,
                height: 14,
              }}
            />
          </Box>
          <Typography align="center" variant="h5">
            {title}
          </Typography>
        </Box>
        <Box height={{ xs: '80%', md: '100%' }}>
          <List>
            {items.map((item) => {
              const selected = item.id === selectedItem?.id
              return (
                <ListItem
                  key={item.id}
                  selected={selected}
                  onClick={() => onSelect?.(item)}
                >
                  {itemRenderer ? (
                    itemRenderer(item, selected)
                  ) : (
                    <ListItemDefaultComponent key={item.id} text={item.name} />
                  )}
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Box>
    </Dialog>
  )
}

export default SelectorDialog
