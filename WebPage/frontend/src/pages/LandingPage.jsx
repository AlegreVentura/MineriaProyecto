import { motion } from 'framer-motion'
import { FaRoute, FaHospital, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Gradient Background - same as Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900"></div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom py-20 md:py-32">
        <div className="text-center mb-16">
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
            Sistema de Análisis de Accidentes
            <br />
            <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
              CDMX
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-4 max-w-4xl mx-auto"
          >
            ¿Para qué quieres usar la herramienta?
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-300 mb-16 max-w-3xl mx-auto"
          >
            Análisis integral usando Machine Learning y optimización espacial
          </motion.p>
        </div>

        {/* Module Selection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {/* Ruteo Seguro Card */}
          <Link to="/ruteo-seguro">
            <div className="bg-gradient-to-br from-primary-900/80 to-primary-800/80 backdrop-blur-xl rounded-2xl p-8 border border-primary-400/30 hover:border-primary-400/50 hover:scale-105 transition-all duration-300 cursor-pointer h-full shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-400/20 rounded-xl mb-6">
                <FaRoute className="text-3xl text-primary-200" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ruteo Seguro CDMX</h3>
              <p className="text-gray-100 mb-6">
                Encuentra las rutas más seguras evitando puntos negros de accidentes
              </p>
              <ul className="space-y-3 mb-6 text-gray-100">
                <li className="flex items-start">
                  <span className="text-primary-200 mr-2 font-bold">✓</span>
                  <span>78K+ accidentes analizados (2019-2023)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-200 mr-2 font-bold">✓</span>
                  <span>299 clusters identificados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-200 mr-2 font-bold">✓</span>
                  <span>Heatmaps temporales interactivos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-200 mr-2 font-bold">✓</span>
                  <span>Rutas alternativas optimizadas</span>
                </li>
              </ul>
              <div className="flex items-center text-primary-200 font-semibold">
                Explorar módulo
                <FaArrowRight className="ml-2" />
              </div>
            </div>
          </Link>

          {/* Hospitales Card */}
          <Link to="/hospitales">
            <div className="bg-gradient-to-br from-accent-900/80 to-accent-800/80 backdrop-blur-xl rounded-2xl p-8 border border-accent-400/30 hover:border-accent-400/50 hover:scale-105 transition-all duration-300 cursor-pointer h-full shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-accent-400/20 rounded-xl mb-6">
                <FaHospital className="text-3xl text-accent-200" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Localización de Hospitales</h3>
              <p className="text-gray-100 mb-6">
                Optimiza la ubicación de nuevos hospitales mediante análisis espacial
              </p>
              <ul className="space-y-3 mb-6 text-gray-100">
                <li className="flex items-start">
                  <span className="text-accent-200 mr-2 font-bold">✓</span>
                  <span>Clusters de accidentes desatendidos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-200 mr-2 font-bold">✓</span>
                  <span>Análisis de cobertura nacional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-200 mr-2 font-bold">✓</span>
                  <span>10 hospitales propuestos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-200 mr-2 font-bold">✓</span>
                  <span>Mejora en tiempos de respuesta</span>
                </li>
              </ul>
              <div className="flex items-center text-accent-200 font-semibold">
                Explorar módulo
                <FaArrowRight className="ml-2" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Footer Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 text-center text-gray-300 text-sm"
        >
          <p className="mb-2">
            <strong>Equipo:</strong> Roberto Jhoshua Alegre Ventura, Alejandro Iram Ramírez Nava
          </p>
          <p className="mb-2">
            <strong>Profesora:</strong> Dra. Ileana Angélica Grave Aguilar
          </p>
          <p>
            <strong>Institución:</strong> UNAM - IIMAS | <strong>Año:</strong> 2025
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage
