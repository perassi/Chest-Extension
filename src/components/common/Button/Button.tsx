import React, { FC } from 'react'

import './Button.scss'

interface ButtonProps {
  children: JSX.Element
  backgroundColor?: string
  width?: string
}

export const Button: FC<ButtonProps> = ({
  children,
  backgroundColor = '#E0007F',
  width = '100%',
}) => {
  return (
    <button
      className="btn"
      style={{ backgroundColor: backgroundColor, width: width }}
    >
      {children}
    </button>
  )
}
