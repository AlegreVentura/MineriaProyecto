import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaRoute, FaPlay, FaInfoCircle, FaRedo, FaFilePdf, FaImage } from 'react-icons/fa'
import RouteMap from './RouteMap'
import { exportToPDF, exportToPNG } from '../utils/exportRoutes'
import { calculateMultipleRoutes } from '../utils/routingService'

const Demo = () => {
  const [origin, setOrigin] = useState('Zócalo (Centro Histórico)')
  const [destination, setDestination] = useState('Polanco (Museo Soumaya)')
  const [routeType, setRouteType] = useState('safe')
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [calculatedRoutes, setCalculatedRoutes] = useState([])

  const presetLocations = [
    'Zócalo (Centro Histórico)',
    'Polanco (Museo Soumaya)',
    'Chapultepec',
    'Reforma',
    'Coyoacán',
    'Condesa',
    'Roma Norte',
    'Santa Fe',
  ]

  // Coordenadas de ubicaciones (lat, lng)
  const locationCoords = {
    'Zócalo (Centro Histórico)': { lat: 19.4326, lng: -99.1332, name: 'Zócalo' },
    'Polanco (Museo Soumaya)': { lat: 19.4406, lng: -99.2042, name: 'Polanco' },
    'Chapultepec': { lat: 19.4203, lng: -99.1826, name: 'Chapultepec' },
    'Reforma': { lat: 19.4270, lng: -99.1677, name: 'Reforma' },
    'Coyoacán': { lat: 19.3467, lng: -99.1618, name: 'Coyoacán' },
    'Condesa': { lat: 19.4112, lng: -99.1730, name: 'Condesa' },
    'Roma Norte': { lat: 19.4185, lng: -99.1640, name: 'Roma Norte' },
    'Santa Fe': { lat: 19.3595, lng: -99.2674, name: 'Santa Fe' },
  }

  // Rutas de ejemplo (Zócalo → Polanco)
  const mockRoutes = [
    {
      type: 'short',
      name: 'Más Corta',
      color: '#3b82f6',
      coordinates: [
        [19.4326, -99.1332], // Zócalo
        [19.4340, -99.1450],
        [19.4360, -99.1580],
        [19.4380, -99.1720],
        [19.4390, -99.1860],
        [19.4400, -99.1980],
        [19.4406, -99.2042], // Polanco
      ],
      distance: '8.74',
      risk: '42.3',
      safety: '57.7',
    },
    {
      type: 'balanced',
      name: 'Balanceada',
      color: '#f59e0b',
      coordinates: [
        [19.4326, -99.1332], // Zócalo
        [19.4330, -99.1400],
        [19.4350, -99.1520],
        [19.4370, -99.1650],
        [19.4385, -99.1780],
        [19.4395, -99.1900],
        [19.4405, -99.2020],
        [19.4406, -99.2042], // Polanco
      ],
      distance: '9.12',
      risk: '35.8',
      safety: '64.2',
    },
    {
      type: 'safe',
      name: 'Más Segura',
      color: '#10b981',
      coordinates: [
        [19.4326, -99.1332], // Zócalo
        [19.4320, -99.1380],
        [19.4340, -99.1500],
        [19.4360, -99.1630],
        [19.4375, -99.1760],
        [19.4390, -99.1890],
        [19.4400, -99.2000],
        [19.4405, -99.2025],
        [19.4406, -99.2042], // Polanco
      ],
      distance: '10.23',
      risk: '28.5',
      safety: '71.5',
    },
  ]

  const routeTypes = [
    { id: 'short', name: 'Más Corta', color: 'blue', description: 'Minimiza distancia' },
    { id: 'balanced', name: 'Balanceada', color: 'orange', description: 'Equilibrio distancia/seguridad' },
    { id: 'safe', name: 'Más Segura', color: 'green', description: 'Maximiza seguridad' },
  ]

  const handleCalculate = async () => {
    setIsLoading(true)
    try {
      // Calcular rutas reales usando OSRM
      const routes = await calculateMultipleRoutes(
        locationCoords[origin],
        locationCoords[destination]
      )
      setCalculatedRoutes(routes)
      setShowResults(true)
    } catch (error) {
      console.error('Error calculando rutas:', error)
      // Usar rutas mock como fallback
      setCalculatedRoutes(mockRoutes)
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setShowResults(false)
    setCalculatedRoutes([])
    setOrigin('Zócalo (Centro Histórico)')
    setDestination('Polanco (Museo Soumaya)')
    setRouteType('safe')
  }

  const handleExportPDF = () => {
    const routes = calculatedRoutes.length > 0 ? calculatedRoutes : mockRoutes
    const selectedRoute = routes.find(r => r.type === routeType) || routes[2]
    const exportData = {
      origin,
      destination,
      selectedRoute,
      routes,
    }
    exportToPDF(exportData)
  }

  const handleExportPNG = () => {
    exportToPNG('route-map', `mapa_${origin.replace(/\s+/g, '_')}`)
  }

  // Obtener estadísticas dinámicas de las rutas
  const getRouteStats = () => {
    const routes = calculatedRoutes.length > 0 ? calculatedRoutes : mockRoutes
    const selectedRoute = routes.find(r => r.type === routeType) || routes[2]
    const shortestRoute = routes.find(r => r.type === 'short') || routes[0]

    const distDiff = (parseFloat(selectedRoute.distance) - parseFloat(shortestRoute.distance)).toFixed(2)
    const distPercent = ((distDiff / parseFloat(shortestRoute.distance)) * 100).toFixed(1)
    const riskDiff = (parseFloat(shortestRoute.risk) - parseFloat(selectedRoute.risk)).toFixed(1)
    const riskPercent = ((riskDiff / parseFloat(shortestRoute.risk)) * 100).toFixed(1)
    const timeDiff = selectedRoute.duration && shortestRoute.duration
      ? selectedRoute.duration - shortestRoute.duration
      : 4

    return {
      selectedRoute,
      distDiff,
      distPercent,
      riskDiff,
      riskPercent,
      timeDiff,
    }
  }

  return (
    <section id="demo" className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-accent-900 text-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Demo <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">Interactiva</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Calcula rutas alternativas considerando 3 capas de riesgo: histórico, clustering espacial y ML predictivo
          </p>
        </motion.div>

        {/* Demo Interface */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6">Configurar Ruta</h3>

              {/* Origin */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium mb-2">
                  <FaMapMarkerAlt className="text-green-400 mr-2" />
                  Origen
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {presetLocations.map((loc) => (
                    <option key={loc} value={loc} className="text-gray-900">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium mb-2">
                  <FaMapMarkerAlt className="text-red-400 mr-2" />
                  Destino
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {presetLocations.map((loc) => (
                    <option key={loc} value={loc} className="text-gray-900">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Route Type */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium mb-3">
                  <FaRoute className="text-primary-400 mr-2" />
                  Tipo de Ruta Preferida
                </label>
                <div className="space-y-3">
                  {routeTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        routeType === type.id
                          ? `border-${type.color}-400 bg-${type.color}-500/20`
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        value={type.id}
                        checked={routeType === type.id}
                        onChange={(e) => setRouteType(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-gray-300">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={isLoading || showResults}
                className="w-full btn-primary bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <FaRedo />
                    </motion.div>
                    <span>Calculando...</span>
                  </>
                ) : (
                  <>
                    <FaPlay />
                    <span>Calcular Ruta</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6">Resultados</h3>

              {showResults ? (
                <div className="space-y-6">
                  {(() => {
                    const stats = getRouteStats()
                    const route = stats.selectedRoute
                    return (
                      <>
                        {/* Route Summary */}
                        <div className="bg-white/20 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold">Ruta Seleccionada</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              routeType === 'safe' ? 'bg-green-500' :
                              routeType === 'balanced' ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}>
                              {route.name} {routeType === 'safe' ? '⭐' : ''}
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Distancia:</span>
                              <span className="font-bold">{route.distance} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Tiempo Estimado:</span>
                              <span className="font-bold">~{route.duration || '24'} min</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Riesgo Promedio:</span>
                              <span className={`font-bold ${
                                parseFloat(route.risk) < 30 ? 'text-green-400' :
                                parseFloat(route.risk) < 40 ? 'text-orange-400' :
                                'text-red-400'
                              }`}>{route.risk} / 100</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Score Seguridad:</span>
                              <span className={`font-bold ${
                                parseFloat(route.safety) > 70 ? 'text-green-400' :
                                parseFloat(route.safety) > 60 ? 'text-orange-400' :
                                'text-red-400'
                              }`}>{route.safety} / 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Comparison */}
                        <div className="bg-white/20 rounded-xl p-6">
                          <h4 className="text-lg font-bold mb-4">Comparación con Ruta Más Corta</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Distancia adicional:</span>
                              <span className="text-green-400 font-bold">+{stats.distDiff} km (+{stats.distPercent}%)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Reducción de riesgo:</span>
                              <span className="text-green-400 font-bold">-{stats.riskDiff} puntos (-{stats.riskPercent}%)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Tiempo adicional:</span>
                              <span className="text-green-400 font-bold">~{stats.timeDiff} minutos</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })()}

                  {/* Recommendation */}
                  {(() => {
                    const stats = getRouteStats()
                    return (
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                          <FaInfoCircle className="text-green-400 text-xl mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold mb-2">Recomendación</h4>
                            <p className="text-sm text-gray-200">
                              La ruta {stats.selectedRoute.name.toLowerCase()} reduce el riesgo en {stats.riskPercent}% con solo {stats.distPercent}% más de distancia.
                              {parseFloat(stats.riskPercent) > 20 && ' Vale la pena el pequeño incremento en tiempo para mayor seguridad.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Interactive Map */}
                  <div className="mt-6" id="route-map">
                    <RouteMap
                      origin={locationCoords[origin]}
                      destination={locationCoords[destination]}
                      routes={calculatedRoutes.length > 0 ? calculatedRoutes : mockRoutes}
                    />
                  </div>

                  {/* Export Buttons */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <FaFilePdf />
                      <span className="text-sm font-medium">Guardar PDF</span>
                    </button>
                    <button
                      onClick={handleExportPNG}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <FaImage />
                      <span className="text-sm font-medium">Guardar PNG</span>
                    </button>
                  </div>

                  {/* New Search Button */}
                  <button
                    onClick={handleReset}
                    className="w-full btn-secondary bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center space-x-2"
                  >
                    <FaRedo />
                    <span>Nueva Búsqueda</span>
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center py-12">
                  <div>
                    <FaRoute className="text-6xl text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Configura origen, destino y tipo de ruta,
                      <br />
                      luego presiona "Calcular Ruta"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-primary-400 mb-2">60%</div>
              <div className="text-sm text-gray-300">Riesgo Histórico</div>
              <div className="text-xs text-gray-400 mt-1">Datos reales de accidentes por tramo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-green-400 mb-2">10%</div>
              <div className="text-sm text-gray-300">Riesgo Clustering</div>
              <div className="text-xs text-gray-400 mt-1">Patrones espaciales DBSCAN</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-purple-400 mb-2">30%</div>
              <div className="text-sm text-gray-300">Riesgo ML</div>
              <div className="text-xs text-gray-400 mt-1">Predicción de gravedad Random Forest</div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default Demo
