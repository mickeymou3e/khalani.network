import { ILinkProps } from '@components/Link'

export interface IHeaderLinkProps
  extends Partial<Pick<ILinkProps, 'linkType' | 'RouterLink'>> {
  onClick?: () => void
  href: string
  searchParams?: string
  text: string
  width?: string | number
  selected?: boolean
}
