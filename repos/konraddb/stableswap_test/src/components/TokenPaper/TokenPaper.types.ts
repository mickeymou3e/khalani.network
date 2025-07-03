import { IEntityWithIconComponent } from '@components/TokenPaperList/TokenPaperList.types'

export interface IEntity {
  id: string
  name: string
}

export interface ITokenPaperProps {
  operationName: string
  description: string
  percentage: number
  token: IEntityWithIconComponent
  selected?: boolean
  onClick?: () => void
}
