import React, { FC, useEffect, useState } from 'react'
import { FolderType } from '../../../@types/global'

import { FolderDropdownNewSubFolder } from './FolderDropdownNewSubFolder'

import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderIcon } from '../../icons/FolderIcon'
import { LockIcon } from '../../icons/LockIcon'
import { PlusIcon } from '../../icons/PlusIcon'

interface FolderDropdownItemProps {
  folder: FolderType
  activeFolder: FolderType
  addNewFolder: boolean
  parentFolderName?: string
  onSelect: (name: FolderType) => void
  onSubFolderCreateCreationStart?: () => void
}

export const FolderDropdownItem: FC<FolderDropdownItemProps> = ({
  folder,
  activeFolder,
  addNewFolder,
  parentFolderName,
  onSelect,
  onSubFolderCreateCreationStart = () => {},
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(false)
  const [showAddNewSubFodler, setShowAddNewSubFodler] = useState<boolean>(false)

  useEffect(() => {
    if (!showChildren && showAddNewSubFodler) setShowAddNewSubFodler(false)
  }, [showChildren])

  const handleFolderClick = () => {
    if (folder.children.length > 0) {
      setShowChildren((prev) => !prev)
    } else {
      onSelect(folder)
    }
  }

  return (
    <>
      <li
        className={`folders-list-item ${
          activeFolder.id === folder.id && 'active'
        }`}
      >
        <div className="folders-list-item-content" onClick={handleFolderClick}>
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

          {folder.visibility === 1 && <LockIcon height={13} width={13} />}
        </div>

        {addNewFolder && (
          <div
            onClick={() => {
              setShowChildren(true)
              setShowAddNewSubFodler(true)
              onSubFolderCreateCreationStart()
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
                parentFolder={folder}
                onHide={() => setShowAddNewSubFodler(false)}
              />
            )}

            {folder.children.map((childFolder) => (
              <FolderDropdownItem
                key={`Child folder of "${folder.name}" - ${childFolder.name}`}
                activeFolder={activeFolder}
                folder={childFolder}
                addNewFolder={false}
                parentFolderName={folder.name}
                onSelect={(curFolder) => onSelect(curFolder)}
                onSubFolderCreateCreationStart={() =>
                  onSubFolderCreateCreationStart()
                }
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
