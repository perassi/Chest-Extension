import React, { FC, useEffect, useRef } from 'react'
import { FolderType } from '../../../@types/global'
import { Visibility } from '../../../@types/visibility'
import firebaseService from '../../../services/firebase.service'

import { FolderIcon } from '../../icons/FolderIcon'
import { LockIcon } from '../../icons/LockIcon'

interface FolderDropdownNewSubFolderProps {
  parentFolder: FolderType
  isPrivate: boolean
  onHide: () => void
}

export const FolderDropdownNewSubFolder: FC<
  FolderDropdownNewSubFolderProps
> = ({ parentFolder, isPrivate, onHide }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()

    const handleFolderCreation = () => {
      if (inputRef.current) {
        if (inputRef.current.value !== '') {
          firebaseService.addNewFolder(
            inputRef.current.value,
            isPrivate ? Visibility.Private : Visibility.Public,
            parentFolder.id,
          )
        }

        onHide()
      }
    }

    const handleInputConfirm = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleFolderCreation()
      }
    }

    const handleEnter = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        handleFolderCreation()
      }
    }

    document.addEventListener('mousedown', handleInputConfirm)
    document.addEventListener('keypress', handleEnter)

    return () => {
      document.removeEventListener('mousedown', handleInputConfirm)
      document.removeEventListener('keypress', handleEnter)
    }
  }, [])

  return (
    <li className="folders-list-item">
      <div className="folders-list-item-content">
        <FolderIcon />

        <p className="folder-name">
          {parentFolder?.name && (
            <span className="folder-name-parent">{parentFolder.name}/ </span>
          )}
        </p>

        <input
          ref={inputRef}
          className="input new-subfolder-input"
          type="text"
          placeholder="Untitled"
        />

        {isPrivate && <LockIcon height={13} width={13} />}
      </div>
    </li>
  )
}
