export interface ListItem {
  id: string
  text: string
  description: string
}

export interface IListProps {
  items: ListItem[]
  itemRenderer?: (item: ListItem, selected?: boolean) => React.ReactNode
  selectedItem: ListItem
  onSelect?: (item: ListItem) => void
}
