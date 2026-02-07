//File name: main.jsx
//Author: Kyle McColgan
//Date: 5 February 2026
//Description: This file contains the main React component for the React timer project.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
