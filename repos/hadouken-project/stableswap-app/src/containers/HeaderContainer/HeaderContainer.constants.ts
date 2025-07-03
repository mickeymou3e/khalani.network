import { getChainConfig } from '@config'
import { isTestOrLocalEnv } from '@constants/NodeEnv'
import { isZkSyncNetwork } from '@hadouken-project/lending-contracts'
import {
  IHeaderLink,
  IPageLink,
  IUserAddressesModal,
  LinkEnum,
} from '@hadouken-project/ui'

export const getExplorerUrls = (chainId: string): Record<string, string> => ({
  ckb: getChainConfig(chainId).explorerUrl.ckb ?? '',
  godwoken: getChainConfig(chainId).explorerUrl.godwoken,
  ethereum: getChainConfig(chainId).explorerUrl.ethereum,
})

export const getUserExplorerAddresses = (
  userAddress: string | null,
  ckbAddress: string | null,
  chainId: string,
): IUserAddressesModal['addresses'] => {
  if (isZkSyncNetwork(chainId)) {
    return [
      {
        address: userAddress || 'loading ...',
        networkName: 'zkSync',
        explorers: [
          {
            url: `${getExplorerUrls(chainId).godwoken}/address/${userAddress}`,
            name: 'zkSync explorer',
          },
          {
            url: `${getExplorerUrls(chainId).ethereum}/address/${userAddress}`,
            name: 'zkSync L1 explorer',
          },
        ],
      },
    ]
  }

  return [
    {
      address: userAddress || 'loading ...',
      networkName: 'Godwoken',
      explorers: [
        {
          url: `${getExplorerUrls(chainId).godwoken}/address/${userAddress}`,
          name: 'Godwoken explorer',
        },
      ],
    },
    {
      address: ckbAddress || 'loading ...',
      networkName: 'Nervos CKB',
      explorers: [
        {
          url: `${getExplorerUrls(chainId).ckb}/address/${ckbAddress}`,
          name: 'CKB explorer',
        },
      ],
    },
  ]
}

export const getRoutes = (
  networkName: string,
  chainId: string,
): IHeaderLink[] => {
  const routes = [
    {
      id: 'trade',
      text: 'Trade',
      pages: [
        {
          id: 'swap-swap',
          linkType: LinkEnum.Internal,
          href: `/${networkName}`,
          text: 'Swap',
        },
        {
          id: 'pools-pools',
          linkType: LinkEnum.Internal,
          href: `/${networkName}/pools`,
          text: 'Pools',
        },
        {
          id: 'mypools',
          linkType: LinkEnum.Internal,
          href: `/${networkName}/my-pools`,
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
          href: `${
            getChainConfig(chainId).hadouken.lending.url
          }/${networkName}`,
          linkType: LinkEnum.External,
          text: 'Market',
        },
        {
          id: 'lending-deposit',
          linkType: LinkEnum.External,
          href: `${
            getChainConfig(chainId).hadouken.lending.url
          }/${networkName}/deposit`,
          text: 'Deposit',
        },
        {
          id: 'lending-borrow',
          linkType: LinkEnum.External,
          href: `${
            getChainConfig(chainId).hadouken.lending.url
          }/${networkName}/borrow`,
          text: 'Borrow',
        },
        {
          id: 'lending-dashboard',
          linkType: LinkEnum.External,
          href: `${
            getChainConfig(chainId).hadouken.lending.url
          }/${networkName}/dashboard`,
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
          linkType: LinkEnum.External,
          href: getChainConfig(chainId).hadouken.bridge.url,
          text: 'Bridge',
        },
      ],
    },
  ]

  if (isTestOrLocalEnv) {
    const othersRoute: IHeaderLink = {
      id: 'others',
      text: 'Others',
      pages: [
        backstopRoute(networkName),
        faucetRoute(networkName),
        lockdropRoute(networkName),
      ],
    }

    routes.push(othersRoute)

    return routes
  } else {
    const backstop: IHeaderLink = {
      id: 'backstop',
      text: '',
      pages: [backstopRoute(networkName)],
    }

    routes.push(backstop)
  }

  return routes
}

const faucetRoute = (networkName: string): IPageLink => ({
  id: 'faucet-faucet',
  linkType: LinkEnum.Internal,
  href: `/${networkName}/faucet`,
  text: 'Faucet',
})

const backstopRoute = (networkName: string): IPageLink => ({
  id: 'backstop-page',
  linkType: LinkEnum.Internal,
  href: `/${networkName}/backstop`,
  text: 'Backstop',
})

const lockdropRoute = (networkName: string): IPageLink => ({
  id: 'lockdrop-page',
  linkType: LinkEnum.Internal,
  href: `/${networkName}/lockdrop`,
  text: 'Lockdrop',
})
