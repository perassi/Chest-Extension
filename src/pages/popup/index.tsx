import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.css';

// const root = createRoot(document.querySelector('#root')!)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// root.render(<App />)
