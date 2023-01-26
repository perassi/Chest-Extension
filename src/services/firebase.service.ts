import { getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore'
import uuid from 'react-uuid'
import { Visibility } from '../@types/visibility'

export const defaultPublicFolderThumbnail =
  'https://firebasestorage.googleapis.com/v0/b/chestr-app.appspot.com/o/constants%2Fempty-public-folder-default.png?alt=media&token=c3573906-e262-49cd-b4ec-936068680809'
export const defaultPrivateFolderThumbnail =
  'https://firebasestorage.googleapis.com/v0/b/chestr-app.appspot.com/o/constants%2Fempty-private-folder-default.png?alt=media&token=b84342e6-9762-4cc6-a1c0-2e56f5b53c75'

class FirebaseService {
  async addNewFolder(
    name: string,
    visibility: Visibility,
    parentFolder: string = '',
  ) {
    const user = getAuth().currentUser
    if (!user) return

    const db = getFirestore()

    const uniqueId = uuid()

    const newFodler = {
      name,
      id: uniqueId,
      userId: user.uid,
      imageUrl:
        visibility === Visibility.Public
          ? defaultPublicFolderThumbnail
          : defaultPrivateFolderThumbnail,
      numItems: 0,
      numViews: 0,
      visibility,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      parent: parentFolder ? parentFolder : '',
    }

    console.log('New folder', newFodler)

    await setDoc(doc(db, 'folders', uniqueId), newFodler)
  }
}

export default new FirebaseService()
