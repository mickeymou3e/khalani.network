import { ReactNode } from 'react'

interface Icon {
  icon: ReactNode
  id: string
  text: string
}

export interface IIconStackViewProps {
  mainIcon: Icon
  onClick?: (id: string) => void
  icons: Icon[]
}
