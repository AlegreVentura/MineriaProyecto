import { motion } from 'framer-motion'
import { FaMapMarkedAlt, FaChartBar, FaRobot, FaArrowDown } from 'react-icons/fa'

const Hero = () => {
  const stats = [
    { value: '78K+', label: 'Accidentes Analizados', icon: FaChartBar },
    { value: '299', label: 'Clusters Identificados', icon: FaMapMarkedAlt },
    { value: '92.48%', label: 'Accuracy ML', icon: FaRobot },
    { value: '32.6%', label: 'Reducción de Riesgo', icon: FaMapMarkedAlt },
  ]

  const handleScroll = () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900"></div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom py-20 md:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium mb-6">
              Proyecto Final de Minería de Datos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Sistema de Ruteo Seguro
            <br />
            <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
              para CDMX
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto"
          >
            Análisis Integral de Accidentes de Tránsito (2019-2023) usando
            Machine Learning, Análisis Espacial y Optimización de Rutas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#demo').scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary text-lg"
            >
              Ver Demo Interactiva
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-secondary text-lg bg-white/10 backdrop-blur-md border-white text-white hover:bg-white/20"
            >
              Conocer Más
            </a>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="text-4xl text-primary-300 mb-3 mx-auto" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer"
      >
        <FaArrowDown className="text-2xl" />
      </motion.button>
    </section>
  )
}

export default Hero
