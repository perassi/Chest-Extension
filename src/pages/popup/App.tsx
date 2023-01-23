import React from 'react'
import { storage } from '@extend-chrome/storage'
import { initializeApp } from 'firebase/app'
import {
  // connectAuthEmulator,
  getAuth,
  signInWithCustomToken,
} from 'firebase/auth'
import { firebaseConfig } from '../../firebaseConfig'

initializeApp(firebaseConfig)
// connectAuthEmulator(getAuth(), 'http://localhost:9099', {
//   disableWarnings: true,
// })

import { Header } from '../../components/layout/Header/Header'
import { FolderDropdown } from '../../components/common/FolderDropdown/FolderDropdown'

import './App.css'

const App = (): JSX.Element => {
  const [data, setData] = React.useState(undefined)
  const [token, setToken] = React.useState<any>(undefined)
  const [userCredential, setUserCredential] = React.useState<any>(undefined)
  React.useEffect(() => {
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
    <div>
      <Header />
      {/* <FolderDropdown /> */}
      <h1>Popup Page</h1>
      <p>If you are seeing this, React is working!</p>
      <pre>{JSON.stringify(token, null, 2)}</pre>
      <pre>{JSON.stringify(userCredential, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App
