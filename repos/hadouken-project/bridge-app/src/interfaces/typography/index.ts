import { LinkProps } from '@mui/material/Link'
import { TypographyTypeMap } from '@mui/material/Typography'

export interface StyledLinkProps extends LinkProps {
  active?: boolean
}

export interface TextProps {
  variant?: TypographyTypeMap['props']['variant']
  component?: React.ElementType
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}
