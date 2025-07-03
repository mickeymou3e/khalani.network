import React from 'react'

export interface ListItem {
  id: string
  text: string
  description: string
}

export interface ISearchListProps {
  items: ListItem[]
  itemRenderer?: (item: ListItem, selected?: boolean) => React.ReactNode
  selectedItem: ListItem
  onSelect?: (item: ListItem) => void
}
