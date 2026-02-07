import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { InsforgeProvider } from '@insforge/react'
import { insforge } from './lib/insforge'
import './index.css'
import App from './App.tsx'
import Success from './Success.tsx'
import CoffeeSplash from './components/CoffeeSplash.tsx'

import ZeroGravity from './components/ZeroGravity.tsx'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InsforgeProvider client={insforge}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/success" element={<Success />} />
          <Route path="/splash" element={<CoffeeSplash />} />
          <Route path="/labs" element={<ZeroGravity />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </InsforgeProvider>
  </StrictMode>,
)
