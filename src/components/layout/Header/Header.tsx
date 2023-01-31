import React, { useContext } from 'react'
import { ProductContext } from '../../../contexts/productContext'
import { ReturnButton } from '../../common/ReturnButton/ReturnButton'

import { ChestrIcon } from '../../icons/ChestrIcon'

import './Header.scss'

export const Header = () => {
  const { pageParsedData } = useContext(ProductContext)

  return (
    <div className="header">
      <div className="header-content">
        <ChestrIcon />

        {pageParsedData?.product?.image ? (
          <p className="header-title text-color-primary-600">Saved!</p>
        ) : (
          <p className="header-title">
            Saved as <span className="text-color-primary-600">link</span> 🔗
          </p>
        )}
      </div>

      <ReturnButton />
    </div>
  )
}
