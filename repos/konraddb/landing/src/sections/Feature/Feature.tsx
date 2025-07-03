import ImageWithText, {
  SectionPosition,
} from '@components/ImageWithText/ImageWithText'
import { Box, useMediaQuery } from '@mui/material'
import React from 'react'
import feature_one from '@images/feature_one.png'
import feature_two from '@images/feature_two.png'
import feature_three from '@images/feature_three.png'

const Feature = () => {
  const isBigDesktop = useMediaQuery('(min-width:1921px)')

  return (
    <Box height="auto" bgcolor={'#619bbe'}>
      <ImageWithText
        image={feature_one}
        position={SectionPosition.Left}
        title="A Platform for Composable Networks"
        subtitle="Khalani is a platform where each deployed module can operate as an open and permissionless solver network. Launch your own solver or solver networks by composing existing modules on the platform, akin to deploying smart contracts, and operate them with Khalani's infrastructure."
        textTopProperty={isBigDesktop ? '22%' : '25%'}
        displayHeader
      />
      <ImageWithText
        image={feature_two}
        position={SectionPosition.Right}
        title="Open and Verifiable Off-chain Collaborations"
        subtitle="Khalani is the only open and transparent platform where networks of solvers allocate their capacities in a fair and verifiable way. It allows intent-centric systems to effortlessly source their solvers, offering unparalleled customizability and accountability for the entire off-chain value flow, instead of working with opaque solver systems that operate entirely in the dark."
        textTopProperty={isBigDesktop ? '1%' : '5%'}
        imageMargin="-25%"
      />
      <ImageWithText
        image={feature_three}
        position={SectionPosition.Left}
        title="Powering Intents for the Best User Experience"
        subtitle="Khalani is the crucial infrastructure required to fully unlock the potential of intent-centric protocols, meeting the demands of rapidly evolving and diverse user expressions to achieve their desired outcomes without compromising the principles of open and permissionless applications."
        textTopProperty={isBigDesktop ? '5%' : '12%'}
        imageMargin="-35%"
      />
    </Box>
  )
}

export default Feature
