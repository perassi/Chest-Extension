import React, { useEffect } from 'react'
import { storage } from '@extend-chrome/storage'

import {
  getAuth,
  signInWithCustomToken,
  UserCredential,
} from 'firebase/auth'

import { Layout } from '../../components/layout/layout'
import { FirebaseContextProvider } from '../../contexts/firebaseContext'

import './App.css'

const App = (): JSX.Element => {
  const [data, setData] = React.useState(undefined)
  const [token, setToken] = React.useState<any>(undefined)
  const [userCredential, setUserCredential] = React.useState<UserCredential>()

  console.log('token', token);
  console.log('userCredential', userCredential)
  console.log('data', data)

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
          return setData(result)
        },
      ),
    )
  }, [])

  return (
    <FirebaseContextProvider>
      <Layout />
      {/* <pre>{JSON.stringify(token, null, 2)}</pre>
      <pre>{JSON.stringify(userCredential, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </FirebaseContextProvider>
  )
}

export default App
