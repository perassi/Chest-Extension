import React, { useEffect, useRef, useState } from 'react'

import { WEB_URL } from '../../config'

import './App.css'

const App = (): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement>()
  const [data, setData] = useState<any>()
  const popup_url =
    WEB_URL + '/extension/popup?extensionId=' + chrome.runtime.id
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
                    setData(result)
                    iframeRef.current?.contentWindow?.postMessage(
                      result,
                      popup_url,
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
              window.close()
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
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <iframe
        ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
        src={popup_url}
        width={341}
        height={515}
      ></iframe>
    </div>
  )
}

export default App
