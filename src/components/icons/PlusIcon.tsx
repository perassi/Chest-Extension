import React, { FC } from 'react'
import { IconProps } from './types'

export const PlusIcon: FC<IconProps> = ({ width = 13, height = 13 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.25629 1.54785V11.8808M1.08984 6.7143H11.4227"
        stroke="#CC0174"
        strokeWidth="1.47613"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
