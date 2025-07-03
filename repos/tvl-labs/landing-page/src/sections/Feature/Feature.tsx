import ImageWithText, {
  SectionPosition,
} from '@components/ImageWithText/ImageWithText'
import { Box, useMediaQuery } from '@mui/material'
import React from 'react'
import feature_one from '@images/feature_one.png'
import feature_two from '@images/feature_two.png'
import feature_three from '@images/feature_three.png'

import feature_one_mobile from '@images/mobile/feature_one.png'
import feature_two_mobile from '@images/mobile/feature_two.png'
import feature_three_mobile from '@images/mobile/feature_three.png'
import config from '@config/'

const Feature = () => {
  const isBigDesktop = useMediaQuery('(min-width:1921px)')
  const isMobile = useMediaQuery(`(max-width: 450px)`)
  const isTablet = useMediaQuery(`(max-width: 1008px)`)

  return (
    <Box height="auto" bgcolor={'#619bbe'}>
      <ImageWithText
        image={isTablet ? feature_one_mobile : feature_one}
        position={SectionPosition.Left}
        title="A Platform for Composable Networks"
        subtitle="Khalani is a platform where each deployed module can operate as an open and permissionless solver network. Launch your own solver or solver networks by composing existing modules on the platform, akin to deploying smart contracts, and operate them with Khalani's infrastructure."
        textTopProperty={isBigDesktop ? '5%' : '7%'}
        buttonText={'Learn More'}
        buttonUrl={config.learnMoreUrl}
      />
      <ImageWithText
        image={isTablet ? feature_two_mobile : feature_two}
        position={SectionPosition.Right}
        title="Open and Verifiable Off-Chain Collaborations"
        subtitle="Khalani is the only open and transparent platform where networks of solvers allocate their capacities in a fair and verifiable way. It allows intent-centric systems to effortlessly source their solvers, offering unparalleled customizability and accountability for the entire off-chain value flow, instead of working with opaque solver systems that operate entirely in the dark."
        textTopProperty={isBigDesktop ? '1%' : '4%'}
        imageMargin={isMobile ? '-15%' : isTablet ? '-5%' : '-25%'}
        buttonText={'Get Early Access'}
        buttonUrl={config.earlyAccessUrl}
      />
      <ImageWithText
        image={isTablet ? feature_three_mobile : feature_three}
        position={SectionPosition.Left}
        title="Powering Intents for the Best User Experience"
        subtitle="Khalani is the crucial infrastructure required to fully unlock the potential of intent-centric protocols, meeting the demands of rapidly evolving and diverse user expressions to achieve their desired outcomes without compromising the principles of open and permissionless applications."
        textTopProperty={isBigDesktop ? '5%' : '3%'}
        imageMargin={isMobile ? '-17%' : isTablet ? '-7%' : '-35%'}
        buttonText={'Read More'}
        buttonUrl={config.readMoreUrl}
      />
    </Box>
  )
}

export default Feature
