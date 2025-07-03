import { ReactElement } from 'react'

import { LinkEnum } from '@components/Link'

export interface IBreadCrumbsProps {
  RouterLink: React.ElementType

  items: {
    id: string
    text: string | ReactElement
    href: string | null
    linkType: LinkEnum | null
  }[]
}
