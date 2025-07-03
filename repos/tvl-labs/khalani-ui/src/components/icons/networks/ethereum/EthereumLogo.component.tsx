import React from 'react'

import { IIcon } from '@interfaces/core'

const EthereumLogo: React.FC<IIcon> = ({ fill, bgFill, ...rest }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <circle cx="32" cy="32" r="32" fill={bgFill || '#EDF0F4'} />
    <path
      d="M31.913 12.8L31.6584 13.6647V38.7536L31.913 39.0076L43.5588 32.1236L31.913 12.8Z"
      fill={fill || '#343434'}
    />
    <path
      d="M31.9128 12.8L20.2667 32.1236L31.9128 39.0076V26.8301V12.8Z"
      fill={fill || '#8C8C8C'}
    />
    <path
      d="M31.913 41.2124L31.7695 41.3873V50.3244L31.913 50.7432L43.5659 34.332L31.913 41.2124Z"
      fill={fill || '#3C3C3B'}
    />
    <path
      d="M31.913 50.7432V41.2124L20.267 34.332L31.913 50.7432Z"
      fill={fill || '#8C8C8C'}
    />
    <path
      d="M31.9131 39.0077L43.5588 32.1238L31.9131 26.8302V39.0077Z"
      fill={fill || '#141414'}
    />
    <path
      d="M20.267 32.1238L31.913 39.0077V26.8302L20.267 32.1238Z"
      fill={fill || '#393939'}
    />
  </svg>
)

export default EthereumLogo
