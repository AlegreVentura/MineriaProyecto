import { motion } from 'framer-motion'
import { FaDatabase, FaMapMarkedAlt, FaBrain, FaRoute, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

const About = () => {
  const features = [
    {
      icon: FaDatabase,
      title: 'Procesamiento de Datos',
      description: 'Limpieza y consolidación de 1.04M accidentes de tránsito (2019-2023)',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FaMapMarkedAlt,
      title: 'Análisis Espacial',
      description: 'Clustering DBSCAN, Hot Spots (Getis-Ord Gi*), Autocorrelación (Moran\'s I)',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaBrain,
      title: 'Machine Learning',
      description: 'Predicción de gravedad con Random Forest, Decision Tree, Stacking Ensemble',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FaRoute,
      title: 'Sistema de Ruteo',
      description: 'Cálculo de rutas seguras usando 3 capas de riesgo (histórico + clustering + ML)',
      color: 'from-red-500 to-red-600'
    },
  ]

  const objectives = [
    {
      icon: FaExclamationTriangle,
      title: 'Problema',
      description: 'La CDMX enfrenta miles de accidentes anuales con pérdidas humanas y económicas significativas.'
    },
    {
      icon: FaCheckCircle,
      title: 'Solución',
      description: 'Sistema integral que identifica zonas de riesgo, predice gravedad y calcula rutas seguras.'
    },
  ]

  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Sobre el <span className="gradient-text">Proyecto</span>
          </h2>
          <p className="section-subtitle">
            Un sistema completo de análisis de accidentes de tránsito que combina técnicas de minería de datos,
            análisis espacial y machine learning para mejorar la seguridad vial en la Ciudad de México.
          </p>
        </motion.div>

        {/* Objectives Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {objectives.map((obj, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card border-l-4 border-primary-600"
            >
              <obj.icon className="text-5xl text-primary-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">{obj.title}</h3>
              <p className="text-gray-600 leading-relaxed">{obj.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold mb-6 text-center">Fuentes de Datos</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-3 text-primary-700">Accidentes de Tránsito</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Base Municipal C5 CDMX (2019-2023)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>~1.04M registros totales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>~78K accidentes en CDMX</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Coordenadas georreferenciadas</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3 text-primary-700">Red Vial</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>OpenStreetMap (OSM)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>99,728 nodos (intersecciones)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>234,532 aristas (tramos de calle)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Descarga automática con OSMnx</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
