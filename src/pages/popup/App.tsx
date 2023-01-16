import React from 'react'

const App = (): JSX.Element => {
  const [data, setData] = React.useState(undefined)
  React.useEffect(() => {
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
  }, [setData])
  return (
    <div>
      <h1>Popup Page</h1>
      <p>If you are seeing this, React is working!</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App
