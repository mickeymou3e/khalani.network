import React from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { BreadCrumbs, LinkEnum } from '@hadouken-project/ui'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { checkIsSupportedNetworkInUrl } from '@utils/network'

const useBreadCrumbs = () => {
  const { pathname } = useLocation()
  const tokens = useSelector(tokenSelectors.selectAll)
  const splitPaths = pathname.split('/')

  const networkInUrl = checkIsSupportedNetworkInUrl(pathname)

  if (!networkInUrl) return []

  if (splitPaths[0] === '' && splitPaths.length === 2) {
    return [
      {
        id: 'lending',
        text: 'Lend',
        href: null,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'lending-assets',
        text: 'Market',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'dashboard' && splitPaths.length === 3) {
    return [
      {
        id: 'lending-dashboard',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'dashboard',
        text: 'Dashboard',
        href: `/${networkInUrl.name}/dashboard`,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'deposit' && splitPaths.length === 3) {
    return [
      {
        id: 'lending-deposit',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'deposit',
        text: 'Deposit',
        href: `/${networkInUrl.name}/deposit`,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'borrow' && splitPaths.length === 3) {
    return [
      {
        id: 'lending-borrow',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'borrow',
        text: 'Borrow',
        href: `/${networkInUrl.name}/borrow`,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'deposit' && splitPaths.length > 3) {
    const token = tokens.find(
      (token) => token.address.toLowerCase() === splitPaths[3].toLowerCase(),
    )
    return [
      {
        id: 'lending-deposit-token',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'deposit-token',
        text: 'Deposit',
        href: `/${networkInUrl.name}/deposit`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'token',
        text: token?.symbol ?? '',
        href: null,
        linkType: null,
      },
    ]
  }

  if (splitPaths[2] === 'withdraw' && splitPaths.length > 3) {
    const token = tokens.find(
      (token) => token.address.toLowerCase() === splitPaths[3].toLowerCase(),
    )

    return [
      {
        id: 'lending-withdraw-token',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'withdraw-token',
        text: `Withdraw ${token?.symbol} `,
        href: null,
        linkType: null,
      },
    ]
  }

  if (splitPaths[2] === 'borrow' && splitPaths.length > 3) {
    const token = tokens.find(
      (token) => token.address.toLowerCase() === splitPaths[3].toLowerCase(),
    )

    return [
      {
        id: 'lending-borrow-token',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'borrow-token',
        text: 'Borrow',
        href: `/${networkInUrl.name}/borrow`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'token',
        text: token?.symbol ?? '',
        href: null,
        linkType: null,
      },
    ]
  }

  if (splitPaths[2] === 'repay' && splitPaths.length > 3) {
    const token = tokens.find(
      (token) => token.address.toLowerCase() === splitPaths[3].toLowerCase(),
    )

    return [
      {
        id: 'lending-repay-token',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'repay-token',
        text: `Repay ${token?.symbol}`,
        href: null,
        linkType: null,
      },
    ]
  }

  if (splitPaths[2] === 'backstop' && splitPaths.length === 3) {
    return [
      {
        id: 'lending-backstop',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'backstop',
        text: 'Backstop',
        href: `/${networkInUrl.name}/backstop`,
        linkType: LinkEnum.Internal,
      },
    ]
  }

  if (splitPaths[2] === 'backstop' && splitPaths.length > 3) {
    return [
      {
        id: 'lending-backstop-action',
        text: 'Lend',
        href: `/${networkInUrl.name}`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'backstop',
        text: 'Backstop',
        href: `/${networkInUrl.name}/backstop`,
        linkType: LinkEnum.Internal,
      },
      {
        id: 'action',
        text: `${splitPaths[2]}`,
        href: null,
        linkType: null,
      },
    ]
  }

  return []
}

const BreadCrumbContainer: React.FC = () => {
  const breadCrumbs = useBreadCrumbs()
  return <BreadCrumbs RouterLink={RouterLink} items={breadCrumbs} />
}

export default BreadCrumbContainer
