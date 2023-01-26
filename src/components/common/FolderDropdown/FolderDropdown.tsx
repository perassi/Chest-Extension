import React, { FC, useState } from 'react'

import { PlusIcon } from '../../icons/PlusIcon'
import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderDropdownItem } from './FolderDropdownItem'
import { NewFolderDialog } from '../../layout/NewFolderDialog/NewFolderDialog'

import './FolderDropdown.scss'
import { FolderType } from '../../../@types/global'

interface FolderDropdownProps {
  folders: FolderType[]
}

export const FolderDropdown: FC<FolderDropdownProps> = ({ folders }) => {
  const [folderName, setFodlerName] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState<boolean>(false)

  return (
    <>
      <div className="folder-dropdown-container">
        <div className="folder-dropdown">
          <input
            type="text"
            value={folderName}
            placeholder={'Add to folder'}
            onChange={(e) => setFodlerName(e.target.value)}
            onSelect={() => setShowDropdown(true)}
          />
          <div
            className={`toggle-dropdown-icon ${showDropdown && 'show'}`}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <ArrowSelectIcon />
          </div>
        </div>

        {showNewFolderDialog && showDropdown ? (
          <NewFolderDialog onReturn={() => setShowNewFolderDialog(false)} />
        ) : (
          <>
            <ul className={`folders-list ${showDropdown && 'active'}`}>
              <li
                className="folders-list-item"
                onClick={() => setShowNewFolderDialog(true)}
              >
                <div className="folders-list-item-content">
                  <div className="folder-list-left-icon">
                    <PlusIcon />
                  </div>
                  <p className="folder-name text-color-primary-700">
                    New Folder
                  </p>
                </div>
              </li>
              {folders.map((parentFolder, index) => (
                <FolderDropdownItem
                  key={`Parent folder ${index}`}
                  parentFolder={parentFolder}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
