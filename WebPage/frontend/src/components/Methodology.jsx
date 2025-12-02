import { motion } from 'framer-motion'
import { FaDatabase, FaBroom, FaCog, FaChartPie, FaCheckCircle, FaLightbulb } from 'react-icons/fa'
import MathFormula from './MathFormula'

const Methodology = () => {
  const kddSteps = [
    {
      step: '00',
      title: 'Entendimiento del Negocio',
      icon: FaLightbulb,
      description: 'Definición del problema y objetivos del análisis de seguridad vial',
      details: [
        'Problema: 78K+ accidentes/año CDMX',
        'Objetivo: Reducir accidentalidad',
        'Stakeholders: Ciudadanos, C5, Gobierno',
        'Métrica éxito: -32.6% riesgo promedio'
      ],
      color: 'from-yellow-500 to-amber-600'
    },
    {
      step: '01',
      title: 'Selección de Datos',
      icon: FaDatabase,
      description: 'Adquisición y filtrado de datos de accidentes C5 CDMX y red vial OSM',
      details: [
        '1.04M accidentes (2019-2023)',
        'Filtro geográfico CDMX',
        'Red vial OpenStreetMap',
        'Coordenadas georreferenciadas'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '02',
      title: 'Preprocesamiento',
      icon: FaBroom,
      description: 'Limpieza y consolidación de datos para garantizar calidad',
      details: [
        'Eliminación de duplicados',
        'Tratamiento de valores nulos',
        'Validación de coordenadas',
        'Normalización de columnas'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      step: '03',
      title: 'Transformación',
      icon: FaCog,
      description: 'Feature engineering y matching espacial con red vial',
      details: [
        'Features temporales (hora, día, mes)',
        'Índice de severidad',
        'Matching con red vial OSM',
        'Agregación por tramo vial'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      step: '04',
      title: 'Minería de Datos',
      icon: FaChartPie,
      description: 'Aplicación de técnicas de análisis espacial y machine learning',
      details: [
        'DBSCAN: 299 clusters',
        'Getis-Ord Gi*: Hot spots',
        'Random Forest: 92.48% accuracy',
        'Índice de riesgo compuesto'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      step: '05',
      title: 'Evaluación',
      icon: FaCheckCircle,
      description: 'Sistema de ruteo seguro con 3 alternativas optimizadas',
      details: [
        'Integración 3 capas de riesgo',
        'Algoritmo de Dijkstra',
        'Rutas: Corta, Balanceada, Segura',
        'Reducción de riesgo hasta 32.6%'
      ],
      color: 'from-red-500 to-red-600'
    },
  ]

  const techniques = [
    {
      category: 'Análisis Espacial',
      methods: [
        { name: 'DBSCAN', formula: '\\epsilon = 200m, \\; min_{samples} = 20', latex: true },
        { name: 'Getis-Ord Gi*', formula: 'G_i^* = \\frac{\\sum_{j=1}^{n} w_{ij}x_j - \\bar{X}\\sum_{j=1}^{n} w_{ij}}{S\\sqrt{\\frac{n\\sum_{j=1}^{n} w_{ij}^2 - (\\sum_{j=1}^{n} w_{ij})^2}{n-1}}}', latex: true },
        { name: 'Moran\'s I', formula: 'I = 0.6837 \\; (p < 0.001)', latex: true },
      ]
    },
    {
      category: 'Machine Learning',
      methods: [
        { name: 'Random Forest', formula: 'Accuracy: 92.48%', latex: false },
        { name: 'Stacking Ensemble', formula: 'Accuracy: 92.48%', latex: false },
        { name: 'Feature Selection', formula: '60 \\rightarrow 20 \\; features', latex: true },
      ]
    },
    {
      category: 'Optimización',
      methods: [
        { name: 'Dijkstra', formula: 'd(v) = \\min(d(v), d(u) + w(u,v))', latex: true },
        { name: 'Riesgo Compuesto', formula: '0.6 \\times hist + 0.3 \\times ML + 0.1 \\times cluster', latex: true },
        { name: '3 Funciones de Peso', formula: 'w_{dist}, w_{balance}, w_{safe}', latex: true },
      ]
    },
  ]

  return (
    <section id="methodology" className="py-20 md:py-32 bg-gray-50">
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
            Metodología <span className="gradient-text">KDD</span>
          </h2>
          <p className="section-subtitle">
            Proceso completo de Knowledge Discovery in Databases aplicado al análisis de accidentes de tránsito
          </p>
        </motion.div>

        {/* KDD Steps */}
        <div className="space-y-8 mb-20">
          {kddSteps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Step Number */}
                <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0">
                  <item.icon className="text-5xl text-gray-700" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Techniques Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12">Técnicas Aplicadas</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {techniques.map((tech, index) => (
              <div key={index} className="card bg-white">
                <h4 className="text-xl font-bold mb-6 text-primary-700 border-b-2 border-primary-200 pb-3">
                  {tech.category}
                </h4>
                <div className="space-y-4">
                  {tech.methods.map((method, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-1">{method.name}</div>
                      {method.latex ? (
                        <MathFormula
                          math={method.formula}
                          inline={true}
                          className="text-sm text-gray-700"
                        />
                      ) : (
                        <div className="text-sm text-gray-600">{method.formula}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formula Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-br from-primary-900 via-purple-900 to-accent-900 rounded-3xl p-6 md:p-16 text-white shadow-2xl"
        >
          <div className="w-full max-w-7xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Fórmula del Índice de Riesgo Compuesto
            </h3>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-12 border-2 border-white/20 shadow-xl overflow-x-auto">
              <div className="min-w-max mx-auto mb-6">
                <MathFormula
                  math="riesgo_{compuesto} = 0.6 \times riesgo_{histórico} + 0.1 \times riesgo_{cluster} + 0.3 \times riesgo_{ML}"
                  className="text-white text-center text-lg md:text-2xl"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t-2 border-white/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-300 mb-2">60%</div>
                  <div className="text-sm font-semibold text-gray-200">Riesgo Histórico</div>
                  <div className="text-xs text-gray-400 mt-1">Accidentes pasados</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-300 mb-2">10%</div>
                  <div className="text-sm font-semibold text-gray-200">Clustering Espacial</div>
                  <div className="text-xs text-gray-400 mt-1">Patrones DBSCAN</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-300 mb-2">30%</div>
                  <div className="text-sm font-semibold text-gray-200">Predicción ML</div>
                  <div className="text-xs text-gray-400 mt-1">Random Forest</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Methodology
