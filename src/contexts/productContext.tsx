import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { getAuth, signInWithCustomToken, UserCredential } from 'firebase/auth'
import { storage } from '@extend-chrome/storage'
import { PageDataType } from '../@types/global'

export const ProductContext = createContext<{
  userCredential: UserCredential
  token: any
  pageParsedData: PageDataType
}>(null!)

export const ProductContextProvider = (props: PropsWithChildren) => {
  const [pageParsedData, setPageParsedData] = useState<PageDataType>(
    {} as PageDataType,
  )
  const [token, setToken] = useState<any>(undefined)
  const [userCredential, setUserCredential] = useState<UserCredential>(
    {} as UserCredential,
  )

  console.log('token', token)
  console.log('userCredential', userCredential)
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
  return (
    <ProductContext.Provider value={{ pageParsedData, token, userCredential }}>
      {props.children}
    </ProductContext.Provider>
  )
}
