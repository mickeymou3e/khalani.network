import config from '@config'
import { IHeaderLink, LinkEnum } from '@hadouken-project/ui'

export const Routes: IHeaderLink[] = [
  {
    id: 'Trade',
    text: 'Trade',
    pages: [
      {
        id: 'Trade-Swap',
        linkType: LinkEnum.Internal,
        href: `/`,
        text: 'Swap',
      },
    ],
  },
  {
    id: 'Liquidity',
    text: 'Liquidity',
    pages: [
      {
        id: 'Liquidity-Pools',
        linkType: LinkEnum.Internal,
        href: `/pools`,
        text: 'Pools',
      },
      {
        id: 'Liquidity-Add',
        linkType: LinkEnum.Internal,
        href: `/pools`,
        text: 'Add',
      },
    ],
  },

  {
    id: 'lending',
    text: 'Lending',
    pages: [
      {
        id: 'Lending-Assets',
        href: `${config.hadouken.lending.url}`,
        linkType: LinkEnum.External,
        text: 'Assets',
      },
      {
        id: 'Lending-Dashboard',
        linkType: LinkEnum.External,
        href: `${config.hadouken.lending.url}/dashboard`,
        text: 'Dashboard',
      },
      {
        id: 'Lending-Deposit',
        linkType: LinkEnum.External,
        href: `${config.hadouken.lending.url}/deposit`,
        text: 'Deposit',
      },
      {
        id: 'Lending-Borrow',
        linkType: LinkEnum.External,
        href: `${config.hadouken.lending.url}/borrow`,
        text: 'Borrow',
      },
    ],
  },
  {
    id: 'BridgeApp',
    text: 'Bridge',
    pages: [
      {
        id: 'Bridge-Deposit',
        linkType: LinkEnum.External,
        href: `${config.hadouken.bridge.url}?action=deposit`,
        text: 'Deposit',
      },
      {
        id: 'Bridge-Withdraw',
        linkType: LinkEnum.External,
        href: `${config.hadouken.bridge.url}?action=withdraw`,
        text: 'Withdraw',
      },
    ],
  },
  {
    id: 'lock',
    text: 'v2',
    pages: [
      {
        id: 'Deposit',
        linkType: LinkEnum.Internal,
        href: '/lock',
        text: 'Deposit',
      },
      {
        id: 'Liquidity',
        linkType: LinkEnum.Internal,
        href: '/liquidity',
        text: 'Liquidity',
      },
      {
        id: 'Mint/Redeem',
        linkType: LinkEnum.Internal,
        href: '/mint',
        text: 'Mint/Redeem',
      },
    ],
  },
]
