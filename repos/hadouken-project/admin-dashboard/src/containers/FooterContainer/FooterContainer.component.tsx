import React from 'react'

import { Footer, LogoIcon } from '@hadouken-project/ui'

const FooterContainer: React.FC = () => {
  const discordLink = 'https://discord.com/invite/pxZJpJPJBH'
  const twitterLink = 'https://twitter.com/HadoukenFinance'

  return (
    <Footer
      logo={LogoIcon}
      discordLink={discordLink}
      twitterLink={twitterLink}
    />
  )
}

export default FooterContainer
