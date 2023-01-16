import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

console.log('popup script')

const root = createRoot(document.querySelector('#root')!)

root.render(<App />)
