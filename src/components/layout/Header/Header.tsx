import React from 'react'
import { ReturnButton } from '../../common/ReturnButton/ReturnButton'

import { ChestrIcon } from '../../icons/ChestrIcon'

import './Header.scss'

export const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <ChestrIcon />

        <p className="header-title text-color-primary-600">Saved!</p>
      </div>

      <ReturnButton />
    </div>
  )
}
