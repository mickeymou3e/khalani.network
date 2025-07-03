import React from 'react'

import { Footer } from '@tvl-labs/khalani-ui'

const FooterContainer: React.FC = () => {
  const discordLink = 'https://discord.com'
  const twitterLink = 'https://twitter.com'

  return <Footer discordLink={discordLink} twitterLink={twitterLink} />
}

export default FooterContainer
