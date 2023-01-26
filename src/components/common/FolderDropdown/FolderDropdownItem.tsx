import React, { FC, useState } from 'react'
import { FolderType } from '../../../@types/global'

import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderIcon } from '../../icons/FolderIcon'
import { LockIcon } from '../../icons/LockIcon'
import { PlusIcon } from '../../icons/PlusIcon'

interface FolderDropdownItemProps {
  parentFolder: FolderType
}

export const FolderDropdownItem: FC<FolderDropdownItemProps> = ({
  parentFolder,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(false)

  return (
    <>
      <li
        className="folders-list-item"
        onClick={() =>
          parentFolder.children.length > 0 && setShowChildren((prev) => !prev)
        }
      >
        <div className="folders-list-item-content">
          {parentFolder.children.length > 0 && (
            <div
              className={`folder-list-left-icon ${showChildren && 'active'}`}
            >
              <ArrowSelectIcon />
            </div>
          )}

          <FolderIcon />

          <p className="folder-name">{parentFolder.name}</p>

          <LockIcon />
        </div>
        <PlusIcon />
      </li>

      {showChildren && (
        <li className="folders-list-children">
          {parentFolder.children.map((childFolder) => (
            <FolderDropdownItem parentFolder={childFolder} />
          ))}
        </li>
      )}
    </>
  )
}
