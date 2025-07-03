import { IHeaderLink, LinkEnum } from '@tvl-labs/khalani-ui'

export const Routes: IHeaderLink[] = [
  {
    id: 'Bridge',
    text: 'Bridge',
    pages: [
      {
        id: 'Bridge',
        linkType: LinkEnum.Internal,
        href: `/bridge`,
        text: 'Bridge',
      },
    ],
  },
  {
    id: 'History',
    text: 'History',
    pages: [
      {
        id: 'History',
        linkType: LinkEnum.Internal,
        href: `/history`,
        text: 'History',
      },
    ],
  },
]
