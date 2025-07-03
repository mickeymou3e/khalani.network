import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setPoolIdToSlug, useGetPoolIdFromSlug } from '@containers/pools/utils'
import { IBreadCrumbsProps, LinkEnum } from '@hadouken-project/ui'
import { Skeleton } from '@mui/material'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import { getPoolFullName } from '@utils/pool'

import { Page, PAGES_PATH } from '../../App'

export const useBreadCrumbs = (): IBreadCrumbsProps['items'] => {
  const poolSelectorById = useSelector(poolSelectors.selectById)

  const { pathname } = useLocation()
  const splitPaths = pathname.split('/')

  const poolId = useGetPoolIdFromSlug()
  const pool = poolSelectorById(poolId)
  const poolName = pool ? (
    getPoolFullName(pool)
  ) : (
    <Skeleton height={25} width={150} />
  )
  const networkInUrl = checkIsSupportedNetworkInUrl(pathname)

  if (!networkInUrl) return []

  if (splitPaths[0] === '' && splitPaths.length === 2) {
    return [
      {
        id: 'tradeMain',
        text: 'Trade',
        href: null,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'swapMain',
        text: 'Swap',
        href: `/${networkInUrl.name}/`,
        linkType: LinkEnum.Internal,
      },
    ]
  }
  if (splitPaths[2] === 'trade') {
    return [
      {
        id: 'tradeMain',
        text: 'Trade',
        href: null,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'swapMain',
        text: 'Swap',
        href: `/${networkInUrl.name}/`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'swapPreview',
        text: 'Preview',
        href: null,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'pools') {
    if (splitPaths.length === 3) {
      return [
        {
          id: 'tradePoolsMain',
          text: 'Trade',
          href: null,
          linkType: LinkEnum.Internal,
        },
        {
          id: 'pools',
          text: 'Pools',
          href: null,
          linkType: LinkEnum.Internal,
        },
      ]
    }

    if (splitPaths.length === 4) {
      return [
        {
          id: 'tradePoolsMain',
          text: 'Trade',
          href: null,
          linkType: LinkEnum.Internal,
        },
        {
          id: 'pools',
          text: 'Pools',
          href: `/${networkInUrl.name}/pools`,
          linkType: LinkEnum.Internal,
        },
        {
          id: 'pools',
          text: poolName,
          href: null,
          linkType: LinkEnum.Internal,
        },
      ]
    }

    if (splitPaths.length === 5) {
      const poolHref =
        pool?.id && setPoolIdToSlug(PAGES_PATH[Page.Pool], pool?.id)

      if (splitPaths[splitPaths.length - 1] === Page.Invest) {
        return [
          {
            id: 'tradePoolsMain',
            text: 'Trade',
            href: null,
            linkType: LinkEnum.Internal,
          },
          {
            id: 'pools',
            text: 'Pools',
            href: `/${networkInUrl.name}` + PAGES_PATH[Page.Pools],
            linkType: LinkEnum.Internal,
          },
          {
            id: 'poolId',
            text: poolName,
            href: `/${networkInUrl.name}` + poolHref ?? '',
            linkType: LinkEnum.Internal,
          },
          {
            id: 'deposit',
            text: 'Invest',
            href: null,
            linkType: LinkEnum.Internal,
          },
        ]
      } else if (splitPaths[splitPaths.length - 1] === Page.Withdraw) {
        return [
          {
            id: 'tradePoolsMain',
            text: 'Trade',
            href: null,
            linkType: LinkEnum.Internal,
          },
          {
            id: 'pools',
            text: 'Pools',
            href: `/${networkInUrl.name}` + PAGES_PATH[Page.Pools],
            linkType: LinkEnum.Internal,
          },
          {
            id: 'poolId',
            text: poolName,
            href: `/${networkInUrl.name}` + poolHref ?? '',
            linkType: LinkEnum.Internal,
          },
          {
            id: 'withdraw',
            text: 'Withdraw',
            href: null,
            linkType: LinkEnum.Internal,
          },
        ]
      }
    }
  }
  if (splitPaths[2] === 'my-pools') {
    return [
      {
        id: 'tradePoolsMain',
        text: 'Trade',
        href: null,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'myLiquidity',
        text: 'My Liquidity',
        href: null,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'lockdrop') {
    return [
      {
        id: 'lockdrop',
        text: 'Lockdrop',
        href: null,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  return []
}
