export interface IInternalTabsSelectorProps {
  tabs: IInternalTab[]
  selectedTab?: number
  onChange?: (path: string | undefined) => void
}

interface IInternalTab {
  label: string
  value: number
  route?: string
}
