import config from '@config'
import { isZkSyncNetwork } from '@hadouken-project/lending-contracts'
import {
  IHeaderLink,
  IPageLink,
  IUserAddressesModal,
  LinkEnum,
} from '@hadouken-project/ui'
import { isTestnetEnv } from '@utils/network'

import { ExplorerAddressesInput } from './HeaderContainer.types'

export const getExplorerAddresses = ({
  chainId,
  l2Address,
  l1Address,
}: ExplorerAddressesInput): IUserAddressesModal['addresses'] => {
  if (isZkSyncNetwork(chainId)) {
    return [
      {
        address: l2Address || 'loading ...',
        networkName: 'zkSync',
        explorers: [
          {
            url: `${config.explorerUrl.zkSync}/address/${l2Address}`,
            name: 'zkSync explorer',
          },
          {
            url: `${config.explorerUrl.goerli}/address/${l2Address}`,
            name: 'zkSync L1 explorer',
          },
        ],
      },
    ]
  }
  return [
    {
      address: l2Address || 'loading ...',
      networkName: 'Godwoken',
      explorers: [
        {
          url: `${config.explorerUrl.godwoken}/address/${l2Address}`,
          name: 'Godwoken explorer',
        },
      ],
    },
    {
      address: l1Address || 'loading ...',
      networkName: 'Nervos CKB',
      explorers: [
        {
          url: `${config.explorerUrl.ckb}/address/${l1Address}`,
          name: 'CKB explorer',
        },
      ],
    },
  ]
}

export const getRoutes = (networkName: string) => {
  const routes = [
    {
      id: 'trade',
      text: 'Trade',
      pages: [
        {
          id: 'trade-swap',
          linkType: LinkEnum.External,
          href: `${config.swapPage}/${networkName}`,
          text: 'Swap',
        },
        {
          id: 'trade-pools',
          linkType: LinkEnum.External,
          href: `${config.swapPage}/${networkName}/pools`,
          text: 'Pools',
        },
        {
          id: 'trade-mypools',
          linkType: LinkEnum.External,
          href: `${config.swapPage}/${networkName}/my-pools`,
          text: 'My Liquidity',
        },
      ],
    },
    {
      id: 'lending',
      text: 'Lend',
      pages: [
        {
          id: 'lending-assets',
          href: `/${networkName}`,
          linkType: LinkEnum.Internal,
          text: 'Market',
        },
        {
          id: 'lending-deposit',
          linkType: LinkEnum.Internal,
          href: `/${networkName}/deposit`,
          text: 'Deposit',
        },
        {
          id: 'lending-borrow',
          linkType: LinkEnum.Internal,
          href: `/${networkName}/borrow`,
          text: 'Borrow',
        },
        {
          id: 'lending-dashboard',
          linkType: LinkEnum.Internal,
          href: `/${networkName}/dashboard`,
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
          href: config.bridgePage,
          text: 'Bridge',
        },
      ],
    },
  ]

  if (isTestnetEnv) {
    const othersRoute: IHeaderLink = {
      id: 'others',
      text: 'Others',
      pages: [backstopRoute(networkName), faucetRoute(networkName)],
    }

    routes.push(othersRoute)

    return routes
  }

  //* NOTE: add if backstop deployed on mainnet
  // routes.push({
  //   id: 'backstop',
  //   text: 'Backstop',
  //   pages: [backstopRoute(networkName)],
  // })

  return routes
}

const faucetRoute = (networkName: string): IPageLink => ({
  id: 'faucet-faucet',
  linkType: LinkEnum.Internal,
  href: `/${networkName}/faucet`,
  text: 'Faucet',
})

const backstopRoute = (networkName: string): IPageLink => ({
  id: 'trade-backstop',
  linkType: LinkEnum.External,
  href: `${config.swapPage}/${networkName}/backstop`,
  text: 'Backstop',
})
