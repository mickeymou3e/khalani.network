import { IHeaderLink, LinkEnum } from '@tvl-labs/khalani-ui'

import config from '../../config'

export const Routes: IHeaderLink[] = [
  {
    id: 'Bridge',
    text: 'Bridge',
    pages: [
      {
        id: 'Bridge',
        linkType: LinkEnum.External,
        href: config.swapURL + `/bridge`,
        text: 'Bridge',
      },
    ],
  },
  {
    id: 'Explorer',
    text: 'Explorer',
    pages: [
      {
        id: 'Explorer',
        linkType: LinkEnum.Internal,
        href: '/explorer',
        text: 'Explorer',
        internalHrefs: ['/explorer'],
      },
    ],
  },
]
