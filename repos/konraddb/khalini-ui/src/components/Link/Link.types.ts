import React from 'react'

import { LinkProps } from '@mui/material/Link'

export enum LinkEnum {
  Internal,
  External,
  Button,
}

export interface ILinkProps extends Omit<LinkProps, 'href' | 'to'> {
  RouterLink?: React.ElementType
  linkType: LinkEnum
  url: string
  searchParams?: string
}
