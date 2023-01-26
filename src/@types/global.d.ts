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

export { FolderType }

declare global {
  interface Window {
    __CHESTR__: any
  }
}
