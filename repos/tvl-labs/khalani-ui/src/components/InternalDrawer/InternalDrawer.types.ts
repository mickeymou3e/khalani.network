import { IChildren } from '@interfaces/children'

export interface IInternalDrawerProps extends IChildren {
  header: string
  subheader: string
  handleCloseClick: () => void
}
