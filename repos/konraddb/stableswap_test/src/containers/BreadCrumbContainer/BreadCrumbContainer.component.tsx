import React from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import { Page } from '@constants/Page'
import { setPoolIdToSlug, useGetPoolIdFromSlug } from '@containers/pools/utils'
import { BreadCrumbs, LinkEnum } from '@hadouken-project/ui'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { useCurrentPath } from '@utils/hooks'

import { PAGES_PATH } from '../../App'

const useBreadCrumbs = () => {
  const poolSelectorById = useSelector(poolSelectors.selectById)

  const path = useCurrentPath()
  const splitPaths = path.split('/')

  const poolId = useGetPoolIdFromSlug()
  const pool = poolSelectorById(poolId)

  if (splitPaths[1] === '') {
    return [
      {
        id: 'trade',
        text: 'Trade',
        href: null,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'swap',
        text: 'Swap',
        href: '/',
        linkType: LinkEnum.Internal,
      },
    ]
  }
  if (splitPaths[1] === 'trade') {
    return [
      {
        id: 'trade',
        text: 'Trade',
        href: null,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'swap',
        text: 'Swap',
        href: '/',
        linkType: LinkEnum.Internal,
      },
      {
        id: 'preview',
        text: 'Preview',
        href: '/swap',
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[1] === 'pools') {
    if (splitPaths.length === 2) {
      return [
        {
          id: 'liquidity',
          text: 'Liquidity',
          href: null,
          linkType: LinkEnum.Internal,
        },
        {
          id: 'pools',
          text: 'Pools',
          href: '/pools',
          linkType: LinkEnum.Internal,
        },
      ]
    }

    if (splitPaths.length === 3) {
      return [
        {
          id: 'liquidity',
          text: 'Liquidity',
          href: null,
          linkType: LinkEnum.Internal,
        },
        {
          id: 'pools',
          text: 'Pools',
          href: '/pools',
          linkType: LinkEnum.Internal,
        },
        {
          id: 'pools',
          text: pool?.name ?? '',
          href: pool?.id ?? '',
          linkType: LinkEnum.Internal,
        },
      ]
    }

    if (splitPaths.length === 4) {
      const poolHref =
        pool?.id && setPoolIdToSlug(PAGES_PATH[Page.Pool], pool?.id)
      const poolDepositHref =
        pool?.id && setPoolIdToSlug(PAGES_PATH[Page.Deposit], pool?.id)
      const poolWithdrawHref =
        pool?.id && setPoolIdToSlug(PAGES_PATH[Page.Withdraw], pool?.id)

      if (splitPaths[splitPaths.length - 1] === Page.Deposit) {
        return [
          {
            id: 'liquidity',
            text: 'Liquidity',
            href: null,
            linkType: LinkEnum.Internal,
          },
          {
            id: 'pools',
            text: 'Pools',
            href: PAGES_PATH[Page.Pools],
            linkType: LinkEnum.Internal,
          },
          {
            id: 'poolId',
            text: pool?.name ?? '',
            href: poolHref ?? '',
            linkType: LinkEnum.Internal,
          },
          {
            id: 'deposit',
            text: 'Invest',
            href: poolDepositHref ?? '',
            linkType: LinkEnum.Internal,
          },
        ]
      } else if (splitPaths[splitPaths.length - 1] === Page.Withdraw) {
        return [
          {
            id: 'liquidity',
            text: 'Liquidity',
            href: null,
            linkType: LinkEnum.Internal,
          },
          {
            id: 'pools',
            text: 'Pools',
            href: PAGES_PATH[Page.Pools],
            linkType: LinkEnum.Internal,
          },
          {
            id: 'poolId',
            text: pool?.name ?? '',
            href: poolHref ?? '',
            linkType: LinkEnum.Internal,
          },
          {
            id: 'withdraw',
            text: 'Withdraw',
            href: poolWithdrawHref ?? '',
            linkType: LinkEnum.Internal,
          },
        ]
      }
    }
  }

  return []
}

const BreadCrumbContainer: React.FC = () => {
  const breadCrumbs = useBreadCrumbs()
  return <BreadCrumbs RouterLink={RouterLink} items={breadCrumbs} />
}

export default BreadCrumbContainer
