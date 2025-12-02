import { motion } from 'framer-motion'
import VisualizacionCard from '../components/VisualizacionCard'
import KPICard from '../components/KPICard'
import Footer from '../components/Footer'

const HospitalesPage = () => {
  const visualizaciones = [
    {
      id: 'mapa',
      title: 'El Problema',
      description: 'Mapa de accidentes y hospitales. Clusters de accidentes (amarillo) alejados de infraestructura hospitalaria (rojo).',
      src: '/visualizations/mapa_accidentes_hospitales.html',
      category: 'problema'
    },
    {
      id: 'estados',
      title: 'Estados Prioritarios',
      description: 'Regiones con mayor necesidad de intervención basadas en densidad de accidentes graves y distancia a hospitales.',
      src: '/visualizations/Estados_Prioritarios.html',
      category: 'priorizacion'
    },
    {
      id: 'hospitales',
      title: 'Hospitales Propuestos',
      description: '10 ubicaciones óptimas priorizadas por número de personas potencialmente beneficiadas.',
      src: '/visualizations/prioridad_hospital_heridos_muertos.html',
      category: 'propuesta'
    },
    {
      id: 'distancias',
      title: 'Impacto Esperado',
      description: 'Reducción significativa en la distancia media. Las barras verdes muestran la mejora en accesibilidad.',
      src: '/visualizations/distancias_medias.html',
      category: 'impacto'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900"></div>

        <div className="relative z-10 container-custom py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium mb-6">
              Análisis Espacial
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Localización Óptima de Hospitales
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Análisis espacial para mejorar tiempos de respuesta en emergencias viales
          </motion.p>
        </div>
      </section>

      {/* KPI Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Indicadores Clave
              </h2>
              <p className="text-lg text-gray-600">
                Métricas que demuestran la necesidad de nuevos hospitales
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <KPICard
                  value="124"
                  label="Personas beneficiadas"
                  subtitle="Con nuevo hospital"
                  color="primary"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <KPICard
                  value="7.54"
                  label="Reducción media de distancia"
                  subtitle="Kilómetros"
                  color="success"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <KPICard
                  value="17"
                  label="Accidentes > 10 km"
                  subtitle="Al hospital más cercano"
                  delta={-74}
                  color="accent"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <KPICard
                  value="Yucatán"
                  label="Estado prioritario"
                  subtitle="Mayor necesidad de intervención"
                  color="warning"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contexto del Problema */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                El Desafío
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                En México, los accidentes de tránsito representan una de las principales causas de muerte
                y lesiones. Sin embargo, <strong>no todos los accidentes ocurren cerca de infraestructura
                hospitalaria</strong>. Nuestro análisis de más de 78,000 accidentes en la Ciudad de México
                revela que existen zonas de alta concentración de accidentes ubicadas a distancias
                considerables de los hospitales existentes.
              </p>

              <p>
                La distancia a un hospital puede ser la diferencia entre la vida y la muerte en situaciones
                de emergencia. Los accidentes graves, especialmente aquellos en carreteras y zonas periféricas,
                frecuentemente ocurren a <strong>más de 10 kilómetros del hospital más cercano</strong>,
                incrementando significativamente los tiempos de respuesta y traslado.
              </p>

              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border-l-4 border-primary-500">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Pregunta clave
                </p>
                <p className="text-gray-700">
                  ¿Dónde deberían ubicarse nuevos hospitales para maximizar la cobertura de atención
                  en zonas con alta densidad de accidentes graves?
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visualizaciones Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visualizaciones Interactivas
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Haz clic en cualquier visualización para explorarla en detalle
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visualizaciones.map((viz, index) => (
                <motion.div
                  key={viz.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <VisualizacionCard
                    title={viz.title}
                    description={viz.description}
                    src={viz.src}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metodología */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestro Enfoque
              </h2>
              <p className="text-lg text-gray-600">
                Aplicamos un proceso de Descubrimiento de Conocimiento (KDD) con técnicas avanzadas
                de análisis espacial
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Fuentes de Datos</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">78,366</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Accidentes analizados</div>
                  <div className="text-xs text-gray-600">CDMX (2019-2023)</div>
                </div>
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-6">
                  <div className="text-3xl font-bold text-accent-600 mb-2">40,000+</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Establecimientos de salud</div>
                  <div className="text-xs text-gray-600">Catálogo CLUES</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6">Proceso de Análisis</h3>
              <div className="space-y-6 text-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Identificación de Clusters</p>
                    <p className="text-sm">
                      Utilizamos <strong>HDBSCAN</strong>, un algoritmo de clustering basado en densidad,
                      para identificar concentraciones geográficas de accidentes. Este método detecta
                      automáticamente zonas críticas sin necesidad de especificar el número de clusters
                      de antemano.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Cálculo de Distancias Geodésicas</p>
                    <p className="text-sm">
                      Implementamos <strong>BallTree con métrica haversine</strong> para calcular con
                      precisión las distancias reales sobre la superficie terrestre entre cada punto de
                      accidente y todos los hospitales existentes, considerando la curvatura de la Tierra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Priorización Multi-criterio</p>
                    <p className="text-sm">
                      Desarrollamos un <strong>score compuesto</strong> que pondera tres factores críticos:
                      la severidad de los accidentes (número de muertos y heridos), la extensión territorial
                      del cluster, y la distancia promedio a hospitales existentes. Esto permite identificar
                      las ubicaciones donde un nuevo hospital tendría el mayor impacto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conclusiones */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Impacto Esperado
              </h2>
              <p className="text-lg text-gray-600">
                Una propuesta basada en datos para salvar vidas
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 shadow-xl mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Las <strong className="text-primary-600">10 ubicaciones propuestas</strong> fueron
                seleccionadas utilizando criterios científicos rigurosos. Cada ubicación fue priorizada
                no solo por su cercanía a zonas de alta accidentalidad, sino también por el número de
                personas que potencialmente se beneficiarían de un acceso más rápido a atención médica
                de emergencia.
              </p>

              <div className="bg-white/80 rounded-xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Reducción de distancia promedio</p>
                    <p className="text-4xl font-bold text-green-600 mb-1">7.54 km</p>
                    <p className="text-xs text-gray-500">En zonas críticas identificadas</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Accidentes lejanos (>10km)</p>
                    <p className="text-4xl font-bold text-accent-600 mb-1">-74%</p>
                    <p className="text-xs text-gray-500">De 91 a 17 accidentes alejados</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                La implementación de estos hospitales podría <strong className="text-primary-600">reducir
                hasta un 50% la distancia promedio</strong> en las zonas más críticas, lo que se traduce
                en minutos cruciales ganados durante emergencias médicas. En situaciones de trauma severo,
                cada minuto cuenta.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary-100"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">10</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Hospitales Propuestos</div>
                <div className="text-xs text-gray-600">Ubicaciones óptimas priorizadas</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-accent-100"
              >
                <div className="text-4xl font-bold text-accent-600 mb-2">50%</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Reducción de Distancia</div>
                <div className="text-xs text-gray-600">En zonas críticas</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary-100"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">124</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Personas Beneficiadas</div>
                <div className="text-xs text-gray-600">Por el primer hospital propuesto</div>
              </motion.div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 text-white text-center">
              <p className="text-lg font-semibold mb-2">
                Una inversión estratégica en infraestructura de salud
              </p>
              <p className="text-sm opacity-90">
                Este análisis proporciona evidencia científica para orientar decisiones de política
                pública en materia de infraestructura hospitalaria y atención de emergencias viales
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HospitalesPage
