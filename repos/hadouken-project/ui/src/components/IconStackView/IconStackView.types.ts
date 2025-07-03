import { ReactNode } from 'react'

interface Icon {
  icon: ReactNode
  id: string
  text: string
}

interface IconStack extends Icon {
  subIcons?: Icon[]
}
export interface IIconStackViewProps {
  mainIcon: Icon
  onClick?: (id: string) => void
  icons: IconStack[]
}
