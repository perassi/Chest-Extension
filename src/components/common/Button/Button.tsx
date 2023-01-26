import React, { FC } from 'react'

import './Button.scss'

interface ButtonProps {
  children: JSX.Element
  backgroundColor?: string
  width?: string
  padding?: string
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({
  children,
  backgroundColor = '#E0007F',
  width = '100%',
  padding = '10.5px',
  onClick,
}) => {
  return (
    <button
      className="btn"
      style={{
        backgroundColor,
        width,
        padding,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
