import React, { FC } from 'react'

import { FolderIcon } from '../../icons/FolderIcon'
import { LockIcon } from '../../icons/LockIcon'

interface FolderDropdownNewSubFolderProps {
  parentFolderName: string
  isPrivate: boolean
}

export const FolderDropdownNewSubFolder: FC<
  FolderDropdownNewSubFolderProps
> = ({ parentFolderName, isPrivate }) => {
  return (
    <li className="folders-list-item">
      <div className="folders-list-item-content">
        <FolderIcon />

        <p className="folder-name">
          {parentFolderName && (
            <span className="folder-name-parent">{parentFolderName}/ </span>
          )}
        </p>

        <input
          className="input new-subfolder-input"
          type="text"
          placeholder="Untitled"
        />

        {isPrivate && <LockIcon height={13} width={13} />}
      </div>
    </li>
  )
}
