import React, { useState } from 'react'

import { FolderIcon } from '../../icons/FolderIcon'
import { PlusIcon } from '../../icons/PlusIcon'
import { ArrowSelectIcon } from '../../icons/ArrowSelectIcon'

import './FolderDropdown.scss'
import { FolderDropdownItem } from './FolderDropdownItem'

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
    name: 'epmty folder',
    children: [],
  },
]

export const FolderDropdown = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [folderName, setFodlerName] = useState<string>('')

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

        <ul className={`folders-list ${showDropdown && 'active'}`}>
          <li className="folders-list-item">
            <div className="folders-list-item-content">
              <div className="folder-list-left-icon">
                <PlusIcon />
              </div>
              <p className="folder-name text-color-primary-700">New Folder</p>
            </div>
          </li>
          {foldersList.map((parentFolder, index) => (
            <FolderDropdownItem
              key={`Parent folder ${index}`}
              parentFolder={parentFolder}
            />
          ))}
        </ul>
      </div>
    </>
  )
}
