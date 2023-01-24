import React, { useState } from 'react'
import { Toggle } from '../../common/Toggle/Toggle'
import { LockIcon } from '../../icons/LockIcon'

import './MakePrivate.scss'

export const MakePrivate = () => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  return (
    <div className="privacy-container">
      <LockIcon />

      <p className='privacy-text'>Make private</p>

      <Toggle
        value={isPrivate}
        onChange={(e) => setIsPrivate(e.currentTarget.checked)}
      />
    </div>
  )
}
