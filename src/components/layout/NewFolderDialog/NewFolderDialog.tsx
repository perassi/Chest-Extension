import React, { FC } from 'react'

import { Button } from '../../common/Button/Button'
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'
import { PencilLineIcon } from '../../icons/PencilLineIcon'
import { PlusIcon } from '../../icons/PlusIcon'
import { MakePrivate } from '../MakePrivate/MakePrivate'

import './NewFolderDialog.scss'

interface NewFolderDialog {
  onReturn: () => void
}

export const NewFolderDialog: FC<NewFolderDialog> = ({ onReturn }) => {
  return (
    <div className="new-folder-container">
      <div className="new-folder-return" onClick={onReturn}>
        <ArrowLeftIcon />
      </div>

      <div className="new-folder-input-container">
        <div className="left-icon">
          <PencilLineIcon />
        </div>
        <input
          className="new-folder-input"
          type="text"
          placeholder="Folder title like “books” etc."
        />
      </div>

      <MakePrivate />

      <div className="button-container">
        <Button width="auto" padding="10.5px 30px">
          <div className="btn-content-chest">
            <p className="btn-content-chest-text">Add folder</p>
            <PlusIcon stroke="#fff" />
          </div>
        </Button>
      </div>
    </div>
  )
}
