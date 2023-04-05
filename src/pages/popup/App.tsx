import React, { useEffect, useRef } from 'react'

import { WEB_URL } from '../../config'

import './App.css'

const App = (): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement>()
  const popup_url = WEB_URL + '/extension/popup?id=' + chrome.runtime.id
  // const [data, setData] = useState(false)

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
                      popup_url,
                    )
                    // chrome.management.getSelf().then(
                    //   self => self.installType == 'development' && setData(result)
                    // )
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

  console.log(popup_url)

  return (
    <div style={{ overflow: 'hidden' }}>
      <iframe
        ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
        src={popup_url}
        width={341}
        height={515}
      ></iframe>
      {/* {
        data && <pre>{JSON.stringify(data, null, 2)}</pre>
      } */}
    </div>
  )
}

export default App
