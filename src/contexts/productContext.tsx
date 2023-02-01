import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { getAuth, signInWithCustomToken, UserCredential } from 'firebase/auth'
import { storage } from '@extend-chrome/storage'
import { PageDataType } from '../@types/global'
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
  const [isAlreadySaved, setIsAlreadySaved] = useState<boolean>(false)

  // console.log('token', token)
  // console.log('userCredential', userCredential)
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
    if (userCredential.user && pageParsedData.product) {
      const q = query(
        collection(getFirestore(), 'products'),
        where('userId', '==', userCredential.user.uid),
      )

      let isProductExists = false
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().productUrl == pageParsedData?.product?.url &&
              !isAlreadySaved
            ) {
              setIsAlreadySaved(true)
              isProductExists = true
            }
          })
        })
        .then(() => {
          if (!isProductExists) {
            firebaseService.addNewProduct(pageParsedData)
          }
        })
    }
  }, [userCredential, pageParsedData])

  return (
    <ProductContext.Provider
      value={{ pageParsedData, token, userCredential, isAlreadySaved }}
    >
      {props.children}
    </ProductContext.Provider>
  )
}
