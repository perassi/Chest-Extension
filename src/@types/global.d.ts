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

type ProductType = {
  brand: string
  description: string
  image: string
  price: number
  priceCurrency: string
  title: string
  url: string
}

type PageDataType = {
  meta: MetaType
  product: ProductType
}

export { FolderType, PageDataType }

declare global {
  interface Window {
    __CHESTR__: any
  }
}
