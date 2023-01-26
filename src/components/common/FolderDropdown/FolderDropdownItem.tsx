import React, { FC, useState } from 'react'
import { FolderType } from '../../../@types/global'

import { FolderDropdownNewSubFolder } from './FolderDropdownNewSubFolder'

import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderIcon } from '../../icons/FolderIcon'
import { LockIcon } from '../../icons/LockIcon'
import { PlusIcon } from '../../icons/PlusIcon'

interface FolderDropdownItemProps {
  folder: FolderType
  addNewFolder: boolean
  parentFolderName?: string
}

export const FolderDropdownItem: FC<FolderDropdownItemProps> = ({
  folder,
  addNewFolder,
  parentFolderName,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(false)
  const [showAddNewSubFodler, setShowAddNewSubFodler] = useState<boolean>(false)

  return (
    <>
      <li className="folders-list-item">
        <div
          className="folders-list-item-content"
          onClick={() =>
            folder.children.length > 0 && setShowChildren((prev) => !prev)
          }
        >
          {folder.children.length > 0 && (
            <div
              className={`folder-list-left-icon ${showChildren && 'active'}`}
            >
              <ArrowSelectIcon />
            </div>
          )}

          <FolderIcon />

          <p className="folder-name">
            {parentFolderName && (
              <span className="folder-name-parent">{parentFolderName}/ </span>
            )}

            {folder.name}
          </p>

          {folder.private && <LockIcon height={13} width={13} />}
        </div>

        {addNewFolder && (
          <div
            onClick={() => {
              setShowChildren(true)
              setShowAddNewSubFodler(true)
            }}
          >
            <PlusIcon />
          </div>
        )}
      </li>

      {showChildren && (
        <>
          <div className="folders-list-children">
            {showAddNewSubFodler && (
              <FolderDropdownNewSubFolder
                isPrivate={folder.private}
                parentFolderName={folder.name}
              />
            )}

            {folder.children.map((childFolder) => (
              <FolderDropdownItem
                key={`Child folder of "${folder.name}" - ${childFolder.name}`}
                folder={childFolder}
                addNewFolder={false}
                parentFolderName={folder.name}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
