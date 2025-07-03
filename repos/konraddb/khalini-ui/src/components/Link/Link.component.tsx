import React from 'react'

import { Link as MUILink } from '@mui/material'

import { ILinkProps, LinkEnum } from './Link.types'

const Link: React.FC<ILinkProps> = ({
  sx,
  className,
  classes,
  linkType = LinkEnum.Internal,
  url,
  children,
  searchParams,
  RouterLink = 'a',
  ...rest
}) => {
  if (linkType === LinkEnum.Internal) {
    return (
      <MUILink
        sx={sx}
        className={className}
        classes={classes}
        component={RouterLink}
        to={{
          pathname: url,
          state: { internalNavigation: true },
          search: searchParams,
        }}
        {...rest}
      >
        {children}
      </MUILink>
    )
  }

  if (linkType === LinkEnum.External) {
    return (
      <MUILink
        sx={sx}
        className={className}
        classes={classes}
        href={url}
        target="_blank"
        {...rest}
      >
        {children}
      </MUILink>
    )
  }

  if (linkType === LinkEnum.Button) {
    const { color, onClick } = rest

    return (
      <MUILink
        sx={sx}
        className={className}
        classes={classes}
        component="button"
        color={color}
        onClick={onClick}
      >
        {children}
      </MUILink>
    )
  }

  return null
}

export default Link
