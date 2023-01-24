import React from 'react'
import { storage } from '@extend-chrome/storage'
import { initializeApp } from 'firebase/app'
import {
  // connectAuthEmulator,
  getAuth,
  signInWithCustomToken,
  UserCredential,
} from 'firebase/auth'
import { firebaseConfig } from '../../firebaseConfig'

// connectAuthEmulator(getAuth(), 'http://localhost:9099', {
//   disableWarnings: true,
// })

import { Header } from '../../components/layout/Header/Header'
import { FolderDropdown } from '../../components/common/FolderDropdown/FolderDropdown'

import { ProductInfo } from '../../components/layout/ProductInfo/ProductInfo'
import { Button } from '../../components/common/Button/Button'
import { LinkExternalIcon } from '../../components/icons/LinkExternalIcon'
import { Footer } from '../../components/layout/Footer/Footer'
import './App.css'

initializeApp(firebaseConfig)

const App = (): JSX.Element => {
  const [data, setData] = React.useState(undefined)
  const [token, setToken] = React.useState<any>(undefined)
  const [userCredential, setUserCredential] = React.useState<UserCredential>()

  console.log('userCredential', userCredential)
  console.log('data', data)

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
    <>
      <Header />

      <FolderDropdown userCredential={userCredential!} />

      <ProductInfo />

      <textarea
        name="product-notes"
        id="product-notes"
        rows={2}
        placeholder={'Notes: e.g size, color, etc...'}
      ></textarea>

      <Button>
        <div className="btn-content-chest">
          <p className="btn-content-chest-text">Go to chest</p>
          <LinkExternalIcon />
        </div>
      </Button>

      <Footer />

      <pre>{JSON.stringify(token, null, 2)}</pre>
      <pre>{JSON.stringify(userCredential, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default App
