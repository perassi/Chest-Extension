import React, { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../../contexts/productContext'
import { ReturnButton } from '../../common/ReturnButton/ReturnButton'

import { ChestrIcon } from '../../icons/ChestrIcon'

import './Header.scss'

enum HeaderState {
  Save,
  AlredySaved,
  SavedAsLink,
}

export const Header = () => {
  const { pageParsedData, isAlreadySaved } = useContext(ProductContext)

  const [headerState, setHeaderState] = useState<HeaderState>(HeaderState.Save)

  useEffect(() => {
    if (isAlreadySaved) {
      setHeaderState(HeaderState.AlredySaved)
      return
    }

    if (pageParsedData?.product?.image) {
      setHeaderState(HeaderState.Save)
    } else {
      setHeaderState(HeaderState.SavedAsLink)
    }
  }, [pageParsedData, isAlreadySaved])

  return (
    <div className="header">
      <div className="header-content">
        <ChestrIcon />

        {headerState === HeaderState.Save && (
          <p className="header-title text-color-primary-600">Saved!</p>
        )}
        {headerState === HeaderState.SavedAsLink && (
          <p className="header-title">
            Saved as <span className="text-color-primary-600">link</span> 🔗
          </p>
        )}
        {headerState === HeaderState.AlredySaved && (
          <p className="header-title">
            Item already <span className="text-color-primary-600">Saved!</span>
          </p>
        )}
      </div>

      <ReturnButton />
    </div>
  )
}
