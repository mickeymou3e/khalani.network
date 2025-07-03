import config from '@config'
import {
  IHeaderLink,
  IPageLink,
  IUserAddressesModal,
  LinkEnum,
} from '@hadouken-project/ui'
import { isTestOrLocalEnv } from '@utils/network'

export const EXPLORER_URLS = {
  ckb: config.explorerUrl.ckb,
  godwoken: config.explorerUrl.godwoken,
  ethereum: config.explorerUrl.ethereum,
}

export const getExplorerAddresses = (
  ethAddress?: string | null,
  ckbAddress?: string | null,
): IUserAddressesModal['addresses'] => [
  {
    address: ethAddress || 'loading ...',
    networkName: 'Godwoken',
    explorers: [
      {
        url: `${EXPLORER_URLS.godwoken}/address/${ethAddress}`,
        name: 'Godwoken explorer',
      },
    ],
  },
  {
    address: ckbAddress || 'loading ...',
    networkName: 'Nervos CKB',
    explorers: [
      {
        url: `${EXPLORER_URLS.ckb}/address/${ckbAddress}`,
        name: 'CKB explorer',
      },
    ],
  },
]

export const getRoutes = (): IHeaderLink[] => {
  const routes = [
    {
      id: 'trade',
      text: 'Trade',
      pages: [
        {
          id: 'trade-swap',
          linkType: LinkEnum.External,
          href: config.hadouken.swap.url,
          text: 'Swap',
        },
        {
          id: 'trade-pools',
          linkType: LinkEnum.External,
          href: `${config.hadouken.swap.url}/pools`,
          text: 'Pools',
        },
        {
          id: 'trade-mypools',
          linkType: LinkEnum.External,
          href: `${config.hadouken.swap.url}/my-pools`,
          text: 'My Liquidity',
        },
      ],
    },
    {
      id: 'lending',
      text: 'Lend',
      pages: [
        {
          id: 'lending-market',
          linkType: LinkEnum.External,
          href: config.hadouken.lending.url,
          text: 'Market',
        },
        {
          id: 'lending-deposit',
          linkType: LinkEnum.External,
          href: `${config.hadouken.lending.url}/deposit`,
          text: 'Deposit',
        },
        {
          id: 'lending-borrow',
          linkType: LinkEnum.External,
          href: `${config.hadouken.lending.url}/borrow`,
          text: 'Borrow',
        },
        {
          id: 'lending-dashboard',
          linkType: LinkEnum.External,
          href: `${config.hadouken.lending.url}/dashboard`,
          text: 'My Positions',
        },
      ],
    },
    {
      id: 'bridge',
      text: '',
      pages: [
        {
          id: 'bridge-bridge',
          linkType: LinkEnum.Internal,
          href: '/',
          text: 'Bridge',
        },
      ],
    },
  ]

  if (isTestOrLocalEnv) {
    const othersRoute: IHeaderLink = {
      id: 'others',
      text: 'Others',
      pages: [backstopRoute, faucet],
    }

    routes.push(othersRoute)

    return routes
  }

  //* NOTE: add if backstop deployed on mainnet
  // routes.push({ id: 'backstop', text: 'Backstop', pages: [backstopRoute] })

  return routes
}

const backstopRoute: IPageLink = {
  id: 'trade-backstop',
  linkType: LinkEnum.External,
  href: `${config.hadouken.swap.url}/backstop`,
  text: 'Backstop',
}

const faucet: IPageLink = {
  id: 'trade-faucet',
  linkType: LinkEnum.External,
  href: `${config.hadouken.swap.url}/faucet`,
  text: 'Faucet',
}
