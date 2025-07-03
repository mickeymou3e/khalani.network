import React from 'react'
import { LearnMoreButton } from './LearnMore.styled'

const LearnMore: React.FC = () => {
  const handleClick = () => {
    window.open(
      'https://blog.khalani.network/introducing-khalani-the-decentralized-solver-infrastructure',
      '_blank',
    )
  }

  return <LearnMoreButton onClick={handleClick}>learn more</LearnMoreButton>
}

export default LearnMore
