import React from 'react'

export interface DirectionIconProps {
  width: number
  height: number
}

const DirectionIcon: React.FC<DirectionIconProps> = ({ height, width }) => {
  return (
    <svg height={height} width={width} viewBox="0 0 32 32" fill="none">
      <path
        d="M1.33333 10.6665C0.533333 10.6665 0 11.1998 0 11.9998V19.9998C0 20.7998 0.533333 21.3332 1.33333 21.3332C2.13333 21.3332 2.66667 20.7998 2.66667 19.9998V11.9998C2.66667 11.1998 2.13333 10.6665 1.33333 10.6665Z"
        fill="#183342"
      />
      <path
        d="M31.4666 15.9999L14.6666 2.5332V10.6665H6.66659C5.86659 10.6665 5.33325 11.1999 5.33325 11.9999V19.9999C5.33325 20.7999 5.86659 21.3332 6.66659 21.3332H14.6666V29.4665L31.4666 15.9999Z"
        fill="#183342"
      />
    </svg>
  )
}
export default DirectionIcon
