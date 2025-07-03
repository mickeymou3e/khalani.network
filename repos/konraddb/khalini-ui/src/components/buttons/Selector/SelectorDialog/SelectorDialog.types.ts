import { ISelectorItem } from '@components/buttons/Selector/Selector.types'
import { IModal } from '@interfaces/core'

export interface ISelectorDialog extends IModal {
  items: ISelectorItem[]
  itemRenderer?: (item: ISelectorItem, selected?: boolean) => React.ReactNode
  onSelect?: (item: ISelectorItem) => void
  selectedItem: ISelectorItem
}
