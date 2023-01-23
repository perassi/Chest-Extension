import React, { FC, useState } from 'react'

import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderIcon } from '../../icons/FolderIcon'
import { PlusIcon } from '../../icons/PlusIcon'

interface FolderDropdownItemProps {
  parentFolder: any
}

export const FolderDropdownItem: FC<FolderDropdownItemProps> = ({
  parentFolder,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(false)

  return (
    <li className="folders-list-item">
      <div
        className="folders-list-item-content"
        onClick={() => setShowChildren((prev) => !prev)}
      >
        {parentFolder.children.length > 0 && (
          <div className={`folder-list-left-icon ${showChildren && 'show'}`}>
            <ArrowSelectIcon />
          </div>
        )}

        <FolderIcon />
        <p className="folder-name">{parentFolder.name}</p>
      </div>
      <PlusIcon />
    </li>
  )
}
