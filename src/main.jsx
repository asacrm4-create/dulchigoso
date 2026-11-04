import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bagel-fat-one/latin-400.css'
import '@fontsource-variable/fredoka/wght.css'
import '@fontsource-variable/schibsted-grotesk/wght.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
