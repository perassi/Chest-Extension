import React, { FC, useState } from 'react'
import { FolderType } from '../../../@types/folder.types'

import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderIcon } from '../../icons/FolderIcon'
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
        </div>
        <PlusIcon />
      </li>
      {showChildren && (
        <li className="folder-list-children">
          {parentFolder.children.map((childFolder) => (
            <FolderDropdownItem parentFolder={childFolder} />
          ))}
        </li>
      )}
    </>
  )
}
