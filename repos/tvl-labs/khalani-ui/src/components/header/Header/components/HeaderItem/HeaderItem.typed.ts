import { IPageLink } from 'src'

export interface IHeaderItemProps {
  page: IPageLink
  routerLink: React.ElementType
  selected: boolean
  onClick: () => void
}
