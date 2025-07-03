import React from 'react'

import config from '@config'
import { Footer } from '@tvl-labs/khalani-ui'

const FooterContainer: React.FC = () => {
  const discordLink = config.discordUrl
  const twitterLink = config.twitterUrl

  return <Footer discordLink={discordLink} twitterLink={twitterLink} />
}

export default FooterContainer
