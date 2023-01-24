import React, { ChangeEvent, FC } from 'react'

import './Toggle.scss'

interface ToggleProps {
  value: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const Toggle: FC<ToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="toggle-label">
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="toggle-track">
        <span className="toggle-indicator"></span>
      </span>
    </label>
  )
}
