import React, { FC } from 'react'
import { IconProps } from './types'

export const ArrowSelectIcon: FC<IconProps> = ({ width = 11, height = 6 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.828125 0.755859L5.25651 5.18425L9.6849 0.755859"
        stroke="#475467"
        strokeWidth="1.47613"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
