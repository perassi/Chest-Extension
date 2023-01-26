import React, { FC } from 'react'
import { Toggle } from '../../common/Toggle/Toggle'
import { LockIcon } from '../../icons/LockIcon'

import './MakePrivate.scss'

interface MakePrivateProps {
  isPrivate: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const MakePrivate: FC<MakePrivateProps> = ({ isPrivate, onChange }) => {
  return (
    <div className="privacy-container">
      <LockIcon />

      <p className="privacy-text">Make private</p>

      <Toggle value={isPrivate} onChange={onChange} />
    </div>
  )
}
