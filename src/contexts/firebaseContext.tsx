import React, { createContext, PropsWithChildren, useContext } from 'react'
import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

import { firebaseConfig } from '../firebaseConfig'

export const FirebaseContext = createContext<{
  app: FirebaseApp
  auth: Auth
  firestore: Firestore
}>(null!)

export const useFirebase = () => useContext(FirebaseContext).app
export const useAuth = () => useContext(FirebaseContext).auth
export const useFirestore = () => useContext(FirebaseContext).firestore

export const FirebaseContextProvider = (props: PropsWithChildren<{}>) => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const firestore = getFirestore(app)

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {props.children}
    </FirebaseContext.Provider>
  )
}
