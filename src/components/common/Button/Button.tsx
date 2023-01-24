import React, { FC } from 'react'

import './Button.scss'

interface ButtonProps {
  children: JSX.Element
  backgroundColor?: string
  width?: string
  padding?: string
}

export const Button: FC<ButtonProps> = ({
  children,
  backgroundColor = '#E0007F',
  width = '100%',
  padding = '10.5px',
}) => {
  return (
    <button
      className="btn"
      style={{
        backgroundColor,
        width,
        padding,
      }}
    >
      {children}
    </button>
  )
}
