import React, { FC } from 'react'
import { IconProps } from './types'

export const ReturnIcon: FC<IconProps> = ({ width = 16, height = 17 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.960938 4.60153H9.75723C12.6721 4.60153 15.035 6.96447 15.035 9.8793C15.035 12.7941 12.6721 15.1571 9.75723 15.1571H0.960938M0.960938 4.60153L4.47946 1.08301M0.960938 4.60153L4.47946 8.12004"
        stroke="#344054"
        stroke-width="1.75926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
