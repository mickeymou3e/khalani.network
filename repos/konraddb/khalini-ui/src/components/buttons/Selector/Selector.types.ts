export interface ISelectorItem {
  id: string
  name: string
}

export interface ISelectorProps {
  title: string
  items: ISelectorItem[]
  onSelect?: (item: ISelectorItem) => void
  selectedItem: ISelectorItem
  itemRenderer?: (item: ISelectorItem, selected?: boolean) => React.ReactNode
}
