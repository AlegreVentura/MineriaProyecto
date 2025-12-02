import { motion } from 'framer-motion'
import { FaCheckCircle, FaExclamationTriangle, FaRocket, FaLightbulb } from 'react-icons/fa'

const Conclusions = () => {
  const achievements = [
    {
      title: 'Sistema Integral de Análisis',
      description: 'Procesamiento de 1.04M registros con limpieza, transformación y feature engineering completo',
      icon: FaCheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'Análisis Espacial Robusto',
      description: '299 clusters DBSCAN, 30 hot spots significativos, Moran\'s I = 0.6837 (clustering confirmado)',
      icon: FaCheckCircle,
      color: 'text-blue-500'
    },
    {
      title: 'ML de Alto Rendimiento',
      description: 'Stacking Ensemble con 92.48% accuracy, feature selection de 60+ a 20 variables',
      icon: FaCheckCircle,
      color: 'text-purple-500'
    },
    {
      title: 'Sistema de Ruteo Funcional',
      description: 'Reducción de riesgo hasta 32.6% con solo 17% más distancia',
      icon: FaCheckCircle,
      color: 'text-orange-500'
    },
  ]

  const limitations = [
    'Datos históricos (2019-2023) requieren actualización periódica',
    'No captura factores como clima, tráfico en tiempo real, eventos especiales',
    'Desbalance de clases: 85% accidentes leves vs 15% graves',
    'Correlación ≠ Causación: modelos identifican patrones, no causas directas',
  ]

  const futureWork = [
    {
      category: 'Corto Plazo (3-6 meses)',
      icon: FaLightbulb,
      color: 'from-green-500 to-green-600',
      items: [
        'Validación con datos 2024',
        'Desarrollar API REST para ruteo',
        'Dashboard interactivo con filtros temporales',
        'Integrar features climáticas (SMAD)',
      ]
    },
    {
      category: 'Mediano Plazo (6-12 meses)',
      icon: FaRocket,
      color: 'from-blue-500 to-blue-600',
      items: [
        'Integración con tráfico en tiempo real (Waze/Google Maps)',
        'Análisis de series de tiempo y estacionalidad',
        'App móvil iOS/Android con ruteo nativo',
        'Sistema de actualización automática de modelos',
      ]
    },
    {
      category: 'Largo Plazo (1-2 años)',
      icon: FaRocket,
      color: 'from-purple-500 to-purple-600',
      items: [
        'Sistema de alertas predictivas en tiempo real',
        'Integración oficial con Secretaría de Movilidad CDMX',
        'Modelo de aprendizaje continuo con feedback de usuarios',
        'Expansión a otras ciudades (Guadalajara, Monterrey, Puebla)',
      ]
    },
  ]

  const impact = [
    {
      category: 'Social',
      description: 'Reducción de accidentes y víctimas, mayor conciencia de seguridad vial',
      icon: '👥'
    },
    {
      category: 'Gubernamental',
      description: 'Políticas públicas basadas en evidencia, optimización de recursos',
      icon: '🏛️'
    },
    {
      category: 'Económico',
      description: 'Reducción de costos por accidentes, menor tiempo perdido en tráfico',
      icon: '💰'
    },
    {
      category: 'Académico',
      description: 'Demostración de aplicación completa de KDD, metodología replicable',
      icon: '🎓'
    },
  ]

  return (
    <section id="conclusions" className="py-20 md:py-32 bg-white">
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
            Conclusiones y <span className="gradient-text">Trabajo Futuro</span>
          </h2>
          <p className="section-subtitle">
            Logros alcanzados, limitaciones identificadas y roadmap de desarrollo
          </p>
        </motion.div>

        {/* Achievements */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Logros del Proyecto</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card flex items-start space-x-4"
              >
                <achievement.icon className={`text-4xl ${achievement.color} flex-shrink-0`} />
                <div>
                  <h4 className="text-lg font-bold mb-2">{achievement.title}</h4>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
            <div className="flex items-start space-x-4 mb-6">
              <FaExclamationTriangle className="text-4xl text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Limitaciones</h3>
                <p className="text-gray-600">
                  Factores y consideraciones importantes identificados durante el desarrollo
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-amber-600 mr-3 font-bold">•</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Future Work */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Roadmap de Desarrollo</h3>
          <div className="space-y-6">
            {futureWork.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center`}>
                    <phase.icon className="text-3xl text-white" />
                  </div>
                  <h4 className="text-2xl font-bold">{phase.category}</h4>
                </div>
                <ul className="grid md:grid-cols-2 gap-3">
                  {phase.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="text-primary-600 mr-2">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-8 text-center">Impacto Potencial</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impact.map((item, index) => (
              <div key={index} className="card text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h4 className="text-lg font-bold mb-2">{item.category}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary-900 to-accent-900 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Este no es solo un proyecto académico
          </h3>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Es una herramienta práctica que puede <strong>salvar vidas</strong> mejorando la seguridad vial en la Ciudad de México
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Conclusions
