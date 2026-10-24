import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AuthPage } from './pages/AuthPage'
import { GuidePage } from './pages/GuidePage'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { PipeOpsWalkthrough } from './pages/PipeOpsWalkthrough'

function App() {
  const { pathname } = useLocation()

  // BrowserRouter keeps the scroll position between pages; start each page at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide/:frameworkId" element={<GuidePage />} />
          <Route path="/walkthrough" element={<PipeOpsWalkthrough />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
