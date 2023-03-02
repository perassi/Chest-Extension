import React, { useEffect, useRef } from 'react'

import { WEB_URL } from '../../config'

import './App.css'

const App = (): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement>()

  useEffect(() => {
    if (iframeRef.current) {
      window.addEventListener('message', function (e) {
        switch (e.data) {
          case 'ready':
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
            break

          case 'login':
            chrome.tabs.create({ url: WEB_URL + '/login' })
            break

          case 'close':
            chrome.tabs.query({ active: true }, ([tab]) => {
              window.close();
            })
            break
          default:
            break
        }
      })
    }
  }, [iframeRef.current])
  return (
    <div>
      <iframe
        ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
        src={WEB_URL + '/extension/popup'}
        width={341}
        height={515}
      ></iframe>
    </div>
  )
}

export default App
