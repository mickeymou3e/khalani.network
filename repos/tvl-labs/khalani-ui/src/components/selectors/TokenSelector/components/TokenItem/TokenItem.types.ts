import { TokenModel } from '@interfaces/core'

export interface ITokenItemProps {
  handleClickOpen: (event: React.MouseEvent<HTMLButtonElement>) => void
  selectedToken?: TokenModel
}
