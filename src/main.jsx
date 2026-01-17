import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './popup'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
)
