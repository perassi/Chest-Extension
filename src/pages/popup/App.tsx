import React from 'react'

import { Header } from '../../components/layout/Header/Header'

import './App.css';

const App = (): JSX.Element => {
  // const [data, setData] = React.useState(undefined)

  // React.useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) =>
  //     chrome.scripting.executeScript(
  //       {
  //         target: {
  //           tabId: tab.id!,
  //         },
  //         func: () => window.__CHESTR__,
  //       },
  //       ([{ result }]: any) => {
  //         console.log('result', result)
  //         return setData(result)
  //       },
  //     ),
  //   )
  // }, [setData])

  return (
    <div className='wrapper'>
      <Header />
    </div>
  )
}

export default App
