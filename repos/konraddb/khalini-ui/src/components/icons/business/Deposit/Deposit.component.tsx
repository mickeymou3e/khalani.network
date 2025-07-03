import React from 'react'

import { IIcon } from '@interfaces/core'

const DepositIcon: React.FC<IIcon> = ({ fill = '#CAF5FF', ...rest }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M25.9626 28H41C41.7956 28 42.5587 27.6839 43.1213 27.1213C43.6839 26.5587 44 25.7956 44 25V13C44 12.2044 43.6839 11.4413 43.1213 10.8787C42.5587 10.3161 41.7956 10 41 10H21C20.2044 10 19.4413 10.3161 18.8787 10.8787C18.3161 11.4413 18 12.2044 18 13V26"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.879 16.879C29.4424 16.3208 30.204 16.0085 30.9971 16.0104C31.7902 16.0122 32.5502 16.3281 33.1111 16.8889C33.6719 17.4497 33.9877 18.2098 33.9896 19.0029C33.9915 19.796 33.6792 20.5576 33.121 21.121"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 16H13.4164C12.4849 16 11.5663 16.2168 10.7332 16.6334L9.56274 17.2186C8.54216 17.7289 7.68826 18.5196 7.1012 19.498L4 24.6666"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 42L17.5237 37.836C19.1321 37.2548 20.512 36.1735 21.4608 34.7507L27.4466 25.7747C27.8688 25.1415 28.0586 24.3817 27.9836 23.6244C27.9087 22.8671 27.5737 22.1592 27.0356 21.621C26.4184 21.0039 25.5813 20.6571 24.7085 20.657C23.8356 20.6569 22.9985 21.0035 22.3812 21.6206L18 26H14"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default DepositIcon
