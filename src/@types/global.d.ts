import { Timestamp } from 'firebase/firestore'
type FolderType = {
  createdAt: any
  updatedAt: any
  name: string
  visibility: number
  numViews: number
  imageUrl: string
  userId: string
  id: string
  private: boolean
  numItems: number
  children: FolderType[]
  parent: string | null
}

type MetaType = {
  description: string
  favicon: string
  image: string
  title: string
  url: string
}
/** According to requirements */
type ProductType = {
  brand: string
  description: string
  image: string
  price: number
  priceCurrency: string
  title: string
  url: string
}

type ProductFirebaseType = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  userId: string
  parent: string | null
  brand: string
  description: string | null
  imageUrl: string
  price: number | null
  priceCurrency: string | null
  title: string | null
  productUrl: string
  note: string
}

type PageDataType = {
  meta: MetaType
  product: ProductType
}

export { FolderType, PageDataType, ProductFirebaseType, ProductType }

declare global {
  interface Window {
    __CHESTR__: any
  }
}
