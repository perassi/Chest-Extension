import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { getAuth, signInWithCustomToken, UserCredential } from 'firebase/auth'
import { storage } from '@extend-chrome/storage'
import { PageDataType, ProductFirebaseType } from '../@types/global'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import firebaseService from '../services/firebase.service'

export const ProductContext = createContext<{
  userCredential: UserCredential
  token: any
  pageParsedData: PageDataType
  product: ProductFirebaseType | null
  isAlreadySaved: boolean
}>(null!)

export const ProductContextProvider = (props: PropsWithChildren) => {
  const [pageParsedData, setPageParsedData] = useState<PageDataType>(
    {} as PageDataType,
  )
  const [token, setToken] = useState<any>(undefined)
  const [userCredential, setUserCredential] = useState<UserCredential>(
    {} as UserCredential,
  )
  const [product, setProduct] = useState<ProductFirebaseType | null>(null)
  const [isAlreadySaved, setAlreadySaved] = useState<boolean>(false)

  console.log('pageParsedData', pageParsedData)

  useEffect(() => {
    storage.local.get('token').then(({ token }) => {
      setToken(token)

      signInWithCustomToken(getAuth(), token).then((userCredential) => {
        setUserCredential(userCredential)
      })
    })

    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) =>
      chrome.scripting.executeScript(
        {
          target: {
            tabId: tab.id!,
          },
          func: () => window.__CHESTR__,
        },
        ([{ result }]: any) => {
          console.log('result', result)

          return setPageParsedData(result)
        },
      ),
    )
  }, [])

  useEffect(() => {
    if (
      userCredential.user &&
      (pageParsedData.meta?.url || pageParsedData.product?.url)
    ) {
      const q = query(
        collection(getFirestore(), 'products'),
        where('userId', '==', userCredential.user.uid),
      )

      let isProductExists = false
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const docUrl = doc.data().productUrl
            const pageUrl =
              pageParsedData?.product?.url ?? pageParsedData?.meta?.url

            if (docUrl == pageUrl && !isAlreadySaved) {
              isProductExists = true
              setAlreadySaved(true)
              setProduct(doc.data() as ProductFirebaseType)
            }
          })
        })
        .then(() => {
          if (!isProductExists) {
            firebaseService
              .addNewProduct(pageParsedData)
              .then((newProduct) =>
                setProduct(newProduct ?? ({} as ProductFirebaseType)),
              )
          }
        })
    }
  }, [userCredential, pageParsedData])

  return (
    <ProductContext.Provider
      value={{ pageParsedData, token, userCredential, product, isAlreadySaved }}
    >
      {props.children}
    </ProductContext.Provider>
  )
}
