import React, { FC } from 'react'

import { ReturnIcon } from '../../icons/ReturnIcon'

import './ReturnButton.scss'

interface ReturnButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const ReturnButton: FC<ReturnButtonProps> = ({ onClick, disabled }) => {
  return (
    <button className="return-btn" onClick={onClick} disabled={disabled}>
      <ReturnIcon />
    </button>
  )
}
