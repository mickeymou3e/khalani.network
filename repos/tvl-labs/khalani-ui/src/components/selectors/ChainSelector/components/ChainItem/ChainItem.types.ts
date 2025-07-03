import { IChain } from '@interfaces/core'

export interface IChainItemProps {
  handleClickOpen: (event: React.MouseEvent<HTMLButtonElement>) => void
  selectedChain?: IChain
}
