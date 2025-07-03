export interface ITokenListProps {
  popularTokensList?: { id: string; symbol: string }[]
  handlePopularTokenList?: (id: string) => void
  selectedTokenList?: { id: string; symbol: string }[]
  handleSelectedTokenList?: (id: string) => void
}
