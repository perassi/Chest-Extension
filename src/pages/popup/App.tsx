import React, { useEffect, useRef } from 'react'
import { WEB_URL } from '../../config'

import './App.css'

const App = (): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement>()

  useEffect(() => {
    if (iframeRef.current) {
      window.addEventListener('message', function (e) {
        if (e.data == 'ready')
          chrome.tabs
            .query({ active: true, currentWindow: true })
            .then(([tab]) =>
              chrome.scripting.executeScript(
                {
                  target: {
                    tabId: tab.id!,
                  },
                  func: () => window.__CHESTR__,
                },
                ([{ result }]: any) => {
                  iframeRef.current?.contentWindow?.postMessage(
                    result,
                    WEB_URL + '/extension/popup',
                  )
                },
              ),
            )
        else if (e.data == 'login') {
          chrome.tabs.create({ url: WEB_URL + '/login' })
        }
      })
    }
  }, [iframeRef.current])

  return (
    // <ProductContextProvider>
    //   <FirebaseContextProvider>
    //     <Layout />
    //   </FirebaseContextProvider>
    // </ProductContextProvider>
    <div>
      <iframe
        ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
        src={WEB_URL + '/extension/popup'}
        width={460}
        height={(460 / 9) * 16}
      ></iframe>
    </div>
  )
}

export default App
