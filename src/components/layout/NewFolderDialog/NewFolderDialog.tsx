import React, { FC, useState } from 'react'
import { Visibility } from '../../../@types/visibility'
import firebaseService from '../../../services/firebase.service'

import { Button } from '../../common/Button/Button'
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'
import { PencilLineIcon } from '../../icons/PencilLineIcon'
import { PlusIcon } from '../../icons/PlusIcon'
import { MakePrivate } from '../MakePrivate/MakePrivate'

import './NewFolderDialog.scss'

interface NewFolderDialog {
  onReturn: () => void
  onFolderCreation?: () => void
}

export const NewFolderDialog: FC<NewFolderDialog> = ({
  onReturn,
  onFolderCreation,
}) => {
  const [folderName, setFolderName] = useState<string>('')
  const [isPrivateFolder, setIsPrivateFolder] = useState<boolean>(false)

  const handleCreateNewFodler = () => {
    if (folderName === '') return
    firebaseService.addNewFolder(
      folderName,
      isPrivateFolder ? Visibility.Private : Visibility.Public,
    )

    if (onFolderCreation) onFolderCreation()
  }

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
          className="input new-folder-input"
          type="text"
          placeholder="Folder title like “books” etc."
          value={folderName}
          onChange={(e) => setFolderName(e.currentTarget.value)}
        />
      </div>

      <MakePrivate
        isPrivate={isPrivateFolder}
        onChange={(e) => setIsPrivateFolder(e.currentTarget.checked)}
      />

      <div className="button-container">
        <Button
          width="auto"
          padding="10.5px 30px"
          onClick={handleCreateNewFodler}
        >
          <div className="btn-content-chest">
            <p className="btn-content-chest-text">Add folder</p>
            <PlusIcon stroke="#fff" />
          </div>
        </Button>
      </div>
    </div>
  )
}
