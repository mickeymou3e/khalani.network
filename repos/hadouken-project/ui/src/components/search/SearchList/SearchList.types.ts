import React from 'react'

export interface IListItem {
  id: string
  text: string
  description: string
  symbol?: string
  displayName: string
  source: string
}

export interface ISearchListProps {
  items: IListItem[]
  itemRenderer?: (item: IListItem, selected?: boolean) => React.ReactNode
  selectedItem?: IListItem
  onSelect?: (item: IListItem) => void
}
