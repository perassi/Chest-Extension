import React from 'react'

import { Layout } from '../../components/layout/layout'
import { FirebaseContextProvider } from '../../contexts/firebaseContext'
import { ProductContextProvider } from '../../contexts/productContext'

import './App.css'

const App = (): JSX.Element => {
  return (
    <ProductContextProvider>
      <FirebaseContextProvider>
        <Layout />
        {/* <pre>{JSON.stringify(token, null, 2)}</pre>
      <pre>{JSON.stringify(userCredential, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </FirebaseContextProvider>
    </ProductContextProvider>
  )
}

export default App
