import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaCar, FaChartLine, FaRoute, FaLightbulb, FaArrowLeft } from 'react-icons/fa'

const Navbar = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Inicio', href: '#hero', icon: FaCar },
    { name: 'Proyecto', href: '#about', icon: FaChartLine },
    { name: 'Metodología', href: '#methodology', icon: FaRoute },
    { name: 'Resultados', href: '#results', icon: FaChartLine },
    { name: 'Demo', href: '#demo', icon: FaRoute },
    { name: 'Conclusiones', href: '#conclusions', icon: FaLightbulb },
  ]

  const handleClick = (href) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isRuteoSeguro = location.pathname === '/ruteo-seguro'
  const isHospitales = location.pathname === '/hospitales'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <FaCar className="text-white text-xl" />
            </div>
            <span className={`text-xl font-bold transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Ruteo Seguro CDMX
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isRuteoSeguro ? (
              // Show navigation links for Ruteo Seguro
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    scrolled
                      ? 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </a>
              ))
            ) : isHospitales ? (
              // Show back button for Hospitales
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  scrolled
                    ? 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FaArrowLeft />
                <span>Volver al Inicio</span>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 bg-white shadow-lg rounded-b-lg">
            {isRuteoSeguro ? (
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleClick(link.href) }}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <link.icon className="text-lg" />
                  <span className="font-medium">{link.name}</span>
                </a>
              ))
            ) : isHospitales ? (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <FaArrowLeft className="text-lg" />
                <span className="font-medium">Volver al Inicio</span>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
