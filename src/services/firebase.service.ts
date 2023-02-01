import { getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore'
import uuid from 'react-uuid'
import { Visibility } from '../@types/visibility'
import { FolderType, PageDataType, ProductFirebaseType } from '../@types/global'

export const defaultPublicFolderThumbnail =
  'https://firebasestorage.googleapis.com/v0/b/chestr-app.appspot.com/o/constants%2Fempty-public-folder-default.png?alt=media&token=c3573906-e262-49cd-b4ec-936068680809'
export const defaultPrivateFolderThumbnail =
  'https://firebasestorage.googleapis.com/v0/b/chestr-app.appspot.com/o/constants%2Fempty-private-folder-default.png?alt=media&token=b84342e6-9762-4cc6-a1c0-2e56f5b53c75'

class FirebaseService {
  async addNewFolder(name: string, visibility: Visibility, parentFolder = '') {
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

    await setDoc(doc(db, 'folders', uniqueId), newFodler)
  }

  async addNewProduct(
    pageData: PageDataType,
    folder: FolderType | null = null,
  ) {
    const user = getAuth().currentUser
    if (!user) return

    const db = getFirestore()
    const { product, meta } = pageData

    const uniqueId = uuid()

    const newProduct: ProductFirebaseType = {
      id: uniqueId,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      brand: product?.brand ?? '',
      description: product?.description ?? null,
      imageUrl: product?.image ?? '',
      price: product?.price ?? null,
      priceCurrency: product?.priceCurrency ?? null,
      productUrl: product?.url ?? meta.url,
      title: product?.title ?? null,
      parent: folder?.id ?? null,
      note: '',
    }

    console.log('newProduct', newProduct)

    await setDoc(doc(db, 'products', uniqueId), newProduct)
  }
}

export default new FirebaseService()
