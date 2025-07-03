import { IHeaderLink, LinkEnum } from '@tvl-labs/khalani-ui'

export const Routes: IHeaderLink[] = [
  {
    id: 'MyMTokens',
    text: 'My MTokens',
    pages: [
      {
        id: 'MyMTokens',
        linkType: LinkEnum.Internal,
        href: `/mTokens`,
        text: 'My MTokens',
      },
    ],
  },
  {
    id: 'Liquidity',
    text: 'My Liquidity',
    pages: [
      {
        id: 'Liquidity',
        linkType: LinkEnum.Internal,
        href: `/liquidity`,
        text: 'My Liquidity',
      },
    ],
  },
]
