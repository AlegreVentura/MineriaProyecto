import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import RuteoSeguroPage from './pages/RuteoSeguroPage'
import HospitalesPage from './pages/HospitalesPage'

function AppContent() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't show Navbar on landing page
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar scrolled={scrolled} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ruteo-seguro" element={<RuteoSeguroPage />} />
        <Route path="/hospitales" element={<HospitalesPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
