export interface ITextTabsSelectorProps {
  tabs: ITextTab[]
  selectedTab?: number
  onChange?: (path: number) => void
}

interface ITextTab {
  label: string
  value: number
}
