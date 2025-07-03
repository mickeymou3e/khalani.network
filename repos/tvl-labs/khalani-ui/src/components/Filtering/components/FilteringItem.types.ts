import { FilteringType } from '../Filtering.types'

export interface IFilteringItemProps {
  type: FilteringType
  onCloseClick: () => void
  onFilterClick: () => void
  value?: string
}
