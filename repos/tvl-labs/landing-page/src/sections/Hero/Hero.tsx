import React from 'react'
import { MainContainer } from './Hero.styled'
import logo from '@images/Khalani - Logo - WHITE.png'
import video from '@images/intro_wideo.mp4'
import { Box, Typography } from '@mui/material'
import Button from '@components/Button/Button'

const Hero = () => {
  return (
    <MainContainer>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="hero-container"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          pr={4}
          pt={5}
          className="text-container"
        >
          <Typography variant="h1">
            Open Network for Intent-driven Autonomous Coordination
          </Typography>
          {/* <Typography variant="body1" color="secondary">
            Khalani is a decentralized solver infrastructure that transforms any
            blockchain-adjacent agent networks into collaborative solver
            networks, orchestrated through an intent-based execution model to
            enable complex user, application, and agent interactions.
          </Typography> */}
          <Typography variant="subtitle2" className="subtitle">
            Khalani Network is a permissionless platform powering intent-driven
            coordination of software systems, enabling seamless interoperability
            between otherwise incompatible services. Khalani introduces a new
            kind of account: the automaton, which is an intent-native account
            model designed to orchestrates complex interactions between solvers,
            solver networks, users, applications, agents and off-chain servers.
          </Typography>
          <Box display="flex" gap={3} className="button-container">
            <Button
              text={'Read White Paper'}
              variant="contained"
              url="https://khalani.network/aip_whitepaper.pdf"
            />
            <Button
              text={'Learn more'}
              variant="outlined"
              url="https://blog.khalani.network/"
            />
          </Box>
        </Box>

        <Box className="video-container" width="40%">
          <video width="100%" height="auto" autoPlay loop muted playsInline>
            <source src={video} type="video/mp4" />
          </video>
        </Box>
      </Box>
    </MainContainer>
  )
}

export default Hero
