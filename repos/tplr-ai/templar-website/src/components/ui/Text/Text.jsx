import clsx from 'clsx'

import localFont from 'next/font/local'
import s from './Text.module.scss'

const SCALES = {
  siteHeadline: 'siteHeadline',
  bigTitle: 'bigTitle',
  mediumTitle: 'mediumTitle',
  bodyCopy: 'bodyCopy',
  techDetails: 'techDetails',
  smallTechDetails: 'smallTechDetails',
}

const aeonikFono = localFont({
  src: '../../../fonts/AeonikFono-Regular.woff2',
  variable: '--font-aeonik-fono',
  weight: '400',
})

const ppNeueMontreal = localFont({
  src: [
    {
      path: '../../../fonts/PPNeueMontreal-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../fonts/PPNeueMontreal-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
})

const Base = ({ as: Component = 'p', scale = 'bodyCopy', webfont, children, className, ...props }) => (
  <Component {...props} className={clsx(webfont.className, s[SCALES[scale]], className)}>
    {children}
  </Component>
)

export const SiteHeadline = (props) => <Base as="h1" scale="siteHeadline" webfont={ppNeueMontreal} {...props} />
export const BigTitle = (props) => <Base as="h2" scale="bigTitle" webfont={ppNeueMontreal} {...props} />
export const MediumTitle = (props) => <Base as="h3" scale="mediumTitle" webfont={ppNeueMontreal} {...props} />
export const BodyCopy = (props) => <Base as="p" scale="bodyCopy" webfont={ppNeueMontreal} {...props} />
export const TechDetails = (props) => <Base as="p" scale="techDetails" webfont={aeonikFono} {...props} />
export const SmallTechDetails = (props) => <Base as="p" scale="smallTechDetails" webfont={aeonikFono} {...props} />

