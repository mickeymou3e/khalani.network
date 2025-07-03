import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import Navigation from '@components/buttons/Navigation'

import { IHeaderLinkProps } from './HeaderLink.types'

const HeaderLink: React.FC<IHeaderLinkProps> = ({
  href,
  searchParams,
  text,
  width,
  selected,
  linkType = LinkEnum.Internal,
  RouterLink,
  onClick,
}) => {
  return (
    <Link
      sx={{
        width: width ?? '100%',
      }}
      searchParams={searchParams}
      underline="none"
      linkType={linkType}
      RouterLink={RouterLink}
      onClick={onClick}
      url={href}
    >
      <Navigation
        sx={{
          width: '100%',
          color: (theme) =>
            selected
              ? theme.palette.text.quaternary
              : theme.palette.text.primary,
        }}
        text={text}
      />
    </Link>
  )
}

export default HeaderLink
