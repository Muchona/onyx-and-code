import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App.tsx'
import Success from './Success.tsx'
import CoffeeSplash from './components/CoffeeSplash.tsx'

const ZeroGravity = lazy(() => import('./components/ZeroGravity.tsx'));
import { HelmetProvider } from 'react-helmet-async'

console.log('VITE BASE_URL:', import.meta.env.BASE_URL);

console.log('VITE BASE_URL:', import.meta.env.BASE_URL);

// --- 301 REDIRECT ENFORCER (Client-Side Fallback) ---
if (window.location.hostname === 'onyxandcode.com') {
  const newUrl = 'https://www.onyxandcode.com' + window.location.pathname + window.location.search;
  window.location.replace(newUrl);
}

// @ts-ignore
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* @ts-ignore */}
    <HelmetProvider context={{}}>
      <BrowserRouter>
        <Suspense fallback={<div className="bg-black h-screen w-screen flex items-center justify-center text-white font-mono">INITIALIZING PHYSICS...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/success" element={<Success />} />
            <Route path="/splash" element={<CoffeeSplash />} />
            <Route path="/labs" element={<ZeroGravity />} />
            <Route path="*" element={<div style={{ background: 'red', color: 'white', padding: '100px', fontSize: '40px', fontWeight: 'bold' }}>404: ROUTE NOT FOUND IN REACT ROUTER</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
