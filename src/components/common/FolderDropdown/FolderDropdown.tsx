import React, { useState } from 'react'

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
]

export const FolderDropdown = () => {
  const [folderName, setFodlerName] = useState<string>('')

  return (
    <>
      <div className="folder-dropdown-container">
        <input
          className="folder-dropdown"
          type="text"
          value={folderName}
          placeholder={'Add to folder'}
          onChange={(e) => setFodlerName(e.target.value)}
          onSelect={(e) => console.log(e)}
        />
        <ul className="folders-list">
          <li className="folders-list-item text-color-primary-700">+ New Folder</li>
          {foldersList.map((parentFolder) => (
            <li className="folders-list-item">{parentFolder.name}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
