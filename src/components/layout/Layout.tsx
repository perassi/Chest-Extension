import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { useAuth, useFirestore } from '../../contexts/firebaseContext'

import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { Button } from '../common/Button/Button'
import { ProductInfo } from './ProductInfo/ProductInfo'
import { FolderDropdown } from '../common/FolderDropdown/FolderDropdown'
import { LinkExternalIcon } from '../icons/LinkExternalIcon'

import { FolderType } from '../../@types/folder.types'

export const Layout = () => {
  const db = useFirestore()
  const user = useAuth().currentUser

  const [folders, setFolders] = useState<FolderType[]>([])

  useEffect(() => {
    const ref = query(
      collection(db, 'folders'),
      where('userId', '==', user?.uid ?? ''),
    )

    const unsub = onSnapshot(ref, (querySnapshot) => {
      const folders: FolderType[] = []
      const subFolders: FolderType[] = []

      querySnapshot.forEach((doc) => {
        if (doc.data().parent) {
          subFolders.push({
            ...(doc.data() as FolderType),
            children: [],
          })
        } else {
          folders.push({
            ...(doc.data() as FolderType),
            children: [],
          })
        }
      })

      for (const subFolder of subFolders) {
        const targetFolder = folders.find(
          (folder) => folder.id === subFolder.parent,
        )
        if (!targetFolder) continue

        const index = folders.indexOf(targetFolder)
        if (index < 0) continue

        // if (isPublic && subFolder.visibility === 1) continue

        folders[index].children.push(subFolder)
      }

      console.log(folders)

      setFolders(folders)
    })

    return () => unsub()
  }, [user])

  return (
    <>
      <Header />

      <FolderDropdown folders={folders} />

      <ProductInfo />

      <textarea
        name="product-notes"
        id="product-notes"
        rows={2}
        placeholder={'Notes: e.g size, color, etc...'}
      ></textarea>

      <Button>
        <div className="btn-content-chest">
          <p className="btn-content-chest-text">Go to chest</p>
          <LinkExternalIcon />
        </div>
      </Button>

      <Footer />
    </>
  )
}
