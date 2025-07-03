export interface IChainChipProps {
  chainId: number
  chainName?: string
  withCloseButton?: boolean
  buttonClickFn?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
  ) => void
}
