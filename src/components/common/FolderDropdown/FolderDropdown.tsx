import React, { FC, useState } from 'react'

import { PlusIcon } from '../../icons/PlusIcon'
import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'
import { FolderDropdownItem } from './FolderDropdownItem'
import { NewFolderDialog } from '../../layout/NewFolderDialog/NewFolderDialog'

import { UserCredential } from 'firebase/auth'
import './FolderDropdown.scss'

const foldersList = [
  {
    name: 'Books',
    children: [
      {
        name: '1',
      },
      {
        name: '2',
      },
      {
        name: '3',
      },
    ],
  },
  {
    name: 'My',
    children: [
      {
        name: '1123123',
      },
      {
        name: '213123',
      },
    ],
  },
  {
    name: 'empty folder',
    children: [],
  },
]

interface FolderDropdownProps {
  userCredential: UserCredential
}

export const FolderDropdown: FC<FolderDropdownProps> = ({ userCredential }) => {
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
              {foldersList.map((parentFolder, index) => (
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
