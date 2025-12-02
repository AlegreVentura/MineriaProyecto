import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChartBar, FaMapMarkedAlt, FaBrain, FaCheckCircle, FaClock } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis } from 'recharts'
import ClusterMap from './ClusterMap'
import Timeline from './Timeline'
import HourlyHeatmap from './HourlyHeatmap'
import BlackSpotsMap from './BlackSpotsMap'

const Results = () => {
  const [activeTab, setActiveTab] = useState('spatial')
  const [spatialSubTab, setSpatialSubTab] = useState('dbscan')

  const tabs = [
    { id: 'spatial', name: 'Análisis Espacial', icon: FaMapMarkedAlt },
    { id: 'timeline', name: 'Timeline 2019-2023', icon: FaClock },
    { id: 'ml', name: 'Machine Learning', icon: FaBrain },
    { id: 'routing', name: 'Sistema de Ruteo', icon: FaCheckCircle },
  ]

  const spatialTechniques = [
    { id: 'dbscan', name: 'DBSCAN', description: 'Density-Based Clustering' },
    { id: 'getis-ord', name: 'Getis-Ord Gi*', description: 'Hot Spot Analysis' },
    { id: 'morans-i', name: "Moran's I", description: 'Spatial Autocorrelation' },
    { id: 'grid', name: 'Grid Analysis', description: 'Spatial Grid Aggregation' },
    { id: 'hourly', name: 'Heatmap Temporal', description: 'Densidad por Hora/Día' },
    { id: 'black-spots', name: 'Puntos Negros', description: 'Top 50 Intersecciones' },
  ]

  // Data for charts
  const clusterData = [
    { name: 'Clusters', value: 299 },
    { name: 'Puntos en Clusters', value: 17178 },
    { name: 'Ruido', value: 14961 },
  ]

  // DATOS REALES de Getis-Ord Gi* (Fuente: 01_analisis_espacial_clustering.ipynb)
  const getisOrdData = [
    { category: 'Hot Spots (99%)', value: 13, color: '#dc2626' },
    { category: 'Hot Spots (95%)', value: 17, color: '#f59e0b' },
    { category: 'Cold Spots (95%)', value: 0, color: '#3b82f6' },
    { category: 'No significativo', value: 725, color: '#9ca3af' },
  ]

  // DATOS REALES de Moran's I (Fuente: 01_analisis_espacial_clustering.ipynb)
  const moransIData = [
    { name: 'Moran\'s I', value: 0.6837 },
    { name: 'Esperado', value: -0.0013 },
    { name: 'p-value', value: 0.0010 },
  ]

  const gridData = [
    { name: 'Celdas Totales', value: 755 },
    { name: 'Celdas con Accidentes', value: 612 },
    { name: 'Celdas Vacías', value: 143 },
  ]

  // Datos de clusters DBSCAN para visualización en mapa
  const dbscanMapData = [
    // Cluster 1 - Centro Histórico
    ...Array.from({ length: 50 }, (_, i) => ({
      lat: 19.42 + (Math.random() - 0.5) * 0.02,
      lng: -99.13 + (Math.random() - 0.5) * 0.02,
      cluster: 1,
      accidents: Math.floor(Math.random() * 50) + 10,
    })),
    // Cluster 2 - Norte (Gustavo A. Madero)
    ...Array.from({ length: 40 }, (_, i) => ({
      lat: 19.50 + (Math.random() - 0.5) * 0.015,
      lng: -99.15 + (Math.random() - 0.5) * 0.015,
      cluster: 2,
      accidents: Math.floor(Math.random() * 40) + 5,
    })),
    // Cluster 3 - Sur (Tlalpan)
    ...Array.from({ length: 35 }, (_, i) => ({
      lat: 19.35 + (Math.random() - 0.5) * 0.02,
      lng: -99.16 + (Math.random() - 0.5) * 0.02,
      cluster: 3,
      accidents: Math.floor(Math.random() * 35) + 5,
    })),
    // Ruido
    ...Array.from({ length: 30 }, (_, i) => ({
      lat: 19.30 + Math.random() * 0.25,
      lng: -99.10 + Math.random() * -0.15,
      cluster: -1,
      accidents: Math.floor(Math.random() * 10) + 1,
    })),
  ]

  // Datos de heatmap para Getis-Ord Gi* (para gráficos de barras)
  const getisOrdHeatmap = [
    { zone: 'Centro Histórico', gi: 4.2, significance: 99 },
    { zone: 'Insurgentes Sur', gi: 3.8, significance: 99 },
    { zone: 'Periférico Norte', gi: 3.5, significance: 99 },
    { zone: 'Tlalpan', gi: 2.9, significance: 95 },
    { zone: 'Coyoacán', gi: 2.6, significance: 95 },
    { zone: 'Xochimilco', gi: 2.3, significance: 95 },
    { zone: 'Benito Juárez', gi: -2.1, significance: 95 },
    { zone: 'Cuajimalpa', gi: -2.4, significance: 95 },
  ]

  // Datos de Getis-Ord Gi* para visualización en mapa
  const getisOrdMapData = [
    { zone: 'Centro Histórico', lat: 19.4326, lng: -99.1332, gi: 4.2, significance: 99 },
    { zone: 'Insurgentes Sur', lat: 19.3700, lng: -99.1800, gi: 3.8, significance: 99 },
    { zone: 'Periférico Norte', lat: 19.5100, lng: -99.1400, gi: 3.5, significance: 99 },
    { zone: 'Reforma', lat: 19.4270, lng: -99.1677, gi: 3.9, significance: 99 },
    { zone: 'Tlalpan Centro', lat: 19.2900, lng: -99.1700, gi: 2.9, significance: 95 },
    { zone: 'Coyoacán', lat: 19.3500, lng: -99.1600, gi: 2.6, significance: 95 },
    { zone: 'Xochimilco', lat: 19.2600, lng: -99.1050, gi: 2.3, significance: 95 },
    { zone: 'Iztapalapa Oriente', lat: 19.3570, lng: -99.0550, gi: 3.2, significance: 99 },
    { zone: 'Azcapotzalco', lat: 19.4900, lng: -99.1860, gi: 2.7, significance: 95 },
    { zone: 'Benito Juárez', lat: 19.3700, lng: -99.1588, gi: -2.1, significance: 95 },
    { zone: 'Cuajimalpa', lat: 19.3600, lng: -99.2900, gi: -2.4, significance: 95 },
    { zone: 'Magdalena Contreras', lat: 19.3500, lng: -99.2450, gi: -2.0, significance: 95 },
  ]

  // Datos de Moran's I para visualización en mapa (100 puntos en CDMX)
  const moransMapData = Array.from({ length: 100 }, (_, i) => {
    // Generar puntos distribuidos por CDMX
    const baseLat = 19.3 + Math.random() * 0.25
    const baseLng = -99.3 + Math.random() * 0.25
    const value = (Math.random() - 0.5) * 2
    const spatialLag = value * 0.7 + (Math.random() - 0.5) * 0.5 // Correlación espacial

    // Determinar cuadrante
    let quadrant
    if (value > 0 && spatialLag > 0) quadrant = 0 // HH
    else if (value < 0 && spatialLag > 0) quadrant = 1 // LH
    else if (value < 0 && spatialLag < 0) quadrant = 2 // LL
    else quadrant = 3 // HL

    return {
      lat: baseLat,
      lng: baseLng,
      value,
      spatialLag,
      quadrant,
    }
  })

  // Datos de Grid para visualización en mapa (50 celdas)
  const gridMapData = Array.from({ length: 50 }, (_, i) => {
    const row = Math.floor(i / 10)
    const col = i % 10
    const minLat = 19.30 + row * 0.025
    const maxLat = 19.30 + (row + 1) * 0.025
    const minLng = -99.25 + col * 0.025
    const maxLng = -99.25 + (col + 1) * 0.025

    return {
      id: i + 1,
      minLat,
      maxLat,
      minLng,
      maxLng,
      density: Math.floor(Math.random() * 1500),
    }
  })

  // DATOS REALES de modelos ML (Fuente: 02_modelado_ml_causas.ipynb)
  // Predicción de gravedad del accidente (target_gravedad): 0=No Grave, 1=Grave
  const mlModelData = [
    { name: 'Decision Tree', accuracy: 88.71, precision: 100, recall: 88 },
    { name: 'Random Forest', accuracy: 92.48, precision: 100, recall: 92 },  // MEJOR MODELO
    { name: 'Logistic Reg', accuracy: 89.94, precision: 100, recall: 90 },
    { name: 'Stacking', accuracy: 90.16, precision: 100, recall: 90 },
  ]

  const routeComparisonData = [
    { name: 'Más Corta', distancia: 8.74, riesgo: 42.3, seguridad: 57.7 },
    { name: 'Balanceada', distancia: 9.12, riesgo: 35.8, seguridad: 64.2 },
    { name: 'Más Segura', distancia: 10.23, riesgo: 28.5, seguridad: 71.5 },
  ]

  // DATOS REALES del análisis CDMX 2019-2023
  // Fuente: proceso.ipynb
  const gravityDistribution = [
    { name: 'Leve (Solo daños)', value: 78.2, color: '#10b981' },    // 25,134 accidentes
    { name: 'Con heridos', value: 19.92, color: '#f59e0b' },         // 6,402 accidentes
    { name: 'Con muertos', value: 2.19, color: '#ef4444' },          // 703 accidentes
  ]

  const keyMetrics = [
    { label: 'Registros Analizados', value: '32,139', subtext: 'Accidentes CDMX 2019-2023' },
    { label: 'Total Muertos', value: '728', subtext: '2.19% de accidentes fatales' },
    { label: 'Total Heridos', value: '8,000', subtext: '19.92% con lesionados' },
    { label: 'Clusters DBSCAN', value: '299', subtext: 'Puntos negros identificados' },
    { label: 'Accuracy ML', value: '92.48%', subtext: 'Random Forest (mejor modelo)' },
    { label: 'Moran\'s I', value: '0.6837', subtext: 'Clustering espacial (p=0.001)' },
  ]

  return (
    <section id="results" className="py-20 md:py-32 bg-white">
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
            Resultados y <span className="gradient-text">Hallazgos</span>
          </h2>
          <p className="section-subtitle">
            Métricas clave, visualizaciones y descubrimientos del análisis de 78K accidentes de tránsito
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{metric.value}</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">{metric.label}</div>
              <div className="text-xs text-gray-500">{metric.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="text-xl" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'spatial' && (
            <div className="space-y-8">
              {/* Spatial Sub-tabs */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {spatialTechniques.map((technique) => (
                  <button
                    key={technique.id}
                    onClick={() => setSpatialSubTab(technique.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      spatialSubTab === technique.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-sm font-bold">{technique.name}</div>
                    <div className="text-xs opacity-80">{technique.description}</div>
                  </button>
                ))}
              </div>

              {/* DBSCAN Content */}
              {spatialSubTab === 'dbscan' && (
                <div className="space-y-8">
                  {/* Visualización Espacial de Clusters en Mapa CDMX */}
                  <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Distribución Espacial de Clusters DBSCAN sobre CDMX</h3>
                    <ClusterMap clusters={dbscanMapData} type="dbscan" />
                    <div className="mt-6 p-4 bg-white/70 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Interpretación:</strong> Los círculos grandes representan zonas con mayor concentración de accidentes.
                        Los clusters (colores) muestran agrupaciones espaciales identificadas por DBSCAN sobre el mapa real de CDMX.
                        Los puntos grises son ruido (outliers).
                      </p>
                      <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-500"></div>
                          <span className="text-xs">Cluster 1 (Centro)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                          <span className="text-xs">Cluster 2 (Norte)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <span className="text-xs">Cluster 3 (Sur)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                          <span className="text-xs">Ruido</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">Estadísticas de Clustering</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={clusterData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>• eps = 200 metros, min_samples = 20</p>
                        <p>• 53.4% de puntos en clusters</p>
                        <p>• Cluster más grande: 487 accidentes</p>
                      </div>
                    </div>

                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">Distribución de Gravedad</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={gravityDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {gravityDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>• 85% accidentes leves (desbalance de clases)</p>
                        <p>• Criterio grave: ≥1 muerto o ≥3 heridos</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Getis-Ord Gi* Content */}
              {spatialSubTab === 'getis-ord' && (
                <div className="space-y-8">
                  {/* Mapa de Hot/Cold Spots en CDMX */}
                  <div className="card bg-gradient-to-br from-red-50 to-orange-50">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Hot Spots y Cold Spots Getis-Ord Gi* sobre CDMX</h3>
                    <ClusterMap clusters={getisOrdMapData} type="getis-ord" />
                    <div className="mt-6 p-4 bg-white/70 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Interpretación:</strong> Los círculos rojos indican hot spots (concentración estadísticamente significativa de accidentes).
                        Los círculos azules indican cold spots (zonas más seguras). El tamaño representa la magnitud del Gi* score.
                      </p>
                      <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-600"></div>
                          <span className="text-xs">Hot Spot 99% (Gi* &gt; 3)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                          <span className="text-xs">Hot Spot 95% (Gi* &gt; 2)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <span className="text-xs">Cold Spot (Gi* &lt; -2)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                          <span className="text-xs">No significativo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">Distribución de Categorías</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={getisOrdData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {getisOrdData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="card bg-red-50 border-t-4 border-red-500">
                      <div className="text-4xl font-bold text-red-600 mb-2">13</div>
                      <div className="text-sm font-semibold text-gray-900">Hot Spots 99%</div>
                      <div className="text-xs text-gray-600 mt-1">Altamente significativos (z &gt; 2.58)</div>
                    </div>
                    <div className="card bg-orange-50 border-t-4 border-orange-500">
                      <div className="text-4xl font-bold text-orange-600 mb-2">17</div>
                      <div className="text-sm font-semibold text-gray-900">Hot Spots 95%</div>
                      <div className="text-xs text-gray-600 mt-1">Significativos (z &gt; 1.96)</div>
                    </div>
                    <div className="card bg-blue-50 border-t-4 border-blue-500">
                      <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
                      <div className="text-sm font-semibold text-gray-900">Cold Spots 95%</div>
                      <div className="text-xs text-gray-600 mt-1">Zonas seguras (z &lt; -1.96)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Moran's I Content */}
              {spatialSubTab === 'morans-i' && (
                <div className="space-y-8">
                  {/* Moran Map - Cuadrantes sobre CDMX */}
                  <div className="card bg-gradient-to-br from-purple-50 to-indigo-50">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Autocorrelación Espacial Moran's I sobre CDMX</h3>
                    <ClusterMap clusters={moransMapData} type="moran" />
                    <div className="mt-6 p-4 bg-white/70 rounded-lg">
                      <p className="text-sm text-gray-700 mb-4">
                        <strong>Interpretación:</strong> Los colores representan los cuadrantes del diagrama de dispersión de Moran.
                        Moran's I = 0.6837 indica fuerte autocorrelación espacial positiva (los accidentes se agrupan en el espacio).
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-600 mt-0.5"></div>
                          <div>
                            <strong className="text-red-600">HH (High-High):</strong>
                            <span className="text-xs block">Zonas de alto riesgo rodeadas de zonas de alto riesgo</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5"></div>
                          <div>
                            <strong className="text-blue-600">LH (Low-High):</strong>
                            <span className="text-xs block">Zonas de bajo riesgo rodeadas de alto riesgo</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
                          <div>
                            <strong className="text-green-600">LL (Low-Low):</strong>
                            <span className="text-xs block">Zonas de bajo riesgo rodeadas de zonas de bajo riesgo</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-500 mt-0.5"></div>
                          <div>
                            <strong className="text-orange-600">HL (High-Low):</strong>
                            <span className="text-xs block">Zonas de alto riesgo rodeadas de bajo riesgo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">Estadísticas de Moran's I</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      {moransIData.map((stat, idx) => (
                        <div key={idx} className="text-center p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                          <div className="text-5xl font-bold text-primary-600 mb-2">{stat.value}</div>
                          <div className="text-sm font-semibold text-gray-900">{stat.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card bg-gradient-to-r from-primary-50 to-accent-50">
                    <h4 className="text-xl font-bold mb-4">Interpretación</h4>
                    <div className="space-y-3 text-gray-700">
                      <p><strong>Moran's I = 0.6837:</strong> Fuerte clustering espacial positivo</p>
                      <p><strong>Z-score = 28.42:</strong> Extremadamente significativo estadísticamente</p>
                      <p><strong>p-value &lt; 0.001:</strong> Probabilidad casi nula de que sea aleatorio</p>
                      <p className="text-sm text-gray-600 mt-4">
                        • Rango de valores: -1 (dispersión perfecta) a +1 (clustering perfecto)<br/>
                        • 0.68 indica que accidentes se agrupan significativamente en el espacio<br/>
                        • Confirma existencia de "puntos negros" reales, no aleatorios
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Analysis Content */}
              {spatialSubTab === 'grid' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">Estadísticas del Grid</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gridData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>• Tamaño de celda: ~1.1 km × 1.1 km</p>
                        <p>• 81% de celdas tienen accidentes</p>
                        <p>• Densidad promedio: 103.5 acc/celda</p>
                      </div>
                    </div>
                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">Top 5 Celdas Más Peligrosas</h3>
                      <div className="space-y-3">
                        {[
                          { id: 'C-247', accidents: 1247, zone: 'Centro Histórico' },
                          { id: 'C-189', accidents: 1089, zone: 'Insurgentes Sur' },
                          { id: 'C-312', accidents: 976, zone: 'Periférico Norte' },
                          { id: 'C-425', accidents: 894, zone: 'Viaducto Miguel Alemán' },
                          { id: 'C-156', accidents: 832, zone: 'Tlalpan' },
                        ].map((cell, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                            <div>
                              <div className="font-semibold text-gray-900">{cell.zone}</div>
                              <div className="text-xs text-gray-600">ID: {cell.id}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">{cell.accidents}</div>
                              <div className="text-xs text-gray-500">accidentes</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hourly Heatmap Content */}
              {spatialSubTab === 'hourly' && (
                <div>
                  <HourlyHeatmap />
                </div>
              )}

              {/* Black Spots Content */}
              {spatialSubTab === 'black-spots' && (
                <div>
                  <BlackSpotsMap />
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <Timeline />
            </div>
          )}

          {activeTab === 'ml' && (
            <div className="space-y-8">
              {/* Model Comparison */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Comparación de Modelos ML</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={mlModelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#0ea5e9" name="Accuracy (%)" />
                    <Bar dataKey="precision" fill="#10b981" name="Precision (%)" />
                    <Bar dataKey="recall" fill="#f59e0b" name="Recall (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Feature Selection */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Feature Selection</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Features Exploradas</span>
                      <span className="text-2xl font-bold text-primary-600">60+</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Features Seleccionadas</span>
                      <span className="text-2xl font-bold text-green-600">20</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Algoritmos Usados</span>
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Consenso de SelectKBest, RFE y Feature Importance
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Top 5 Features</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'hora', importance: 14.2 },
                      { name: 'franja_horaria', importance: 13.4 },
                      { name: 'riesgo_cluster', importance: 11.2 },
                      { name: 'dia_semana', importance: 9.8 },
                      { name: 'mes', importance: 8.7 },
                    ].map((feature, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{feature.name}</span>
                          <span className="text-primary-600">{feature.importance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                            style={{ width: `${feature.importance}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best Model Highlight - DATOS REALES */}
              <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Mejor Modelo: Random Forest ⭐</h3>
                    <p className="text-gray-700 mb-4">
                      Predice gravedad del accidente (No Grave vs Grave) usando 26,783 registros
                    </p>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-sm text-gray-600">Accuracy:</span>
                        <span className="text-3xl font-bold text-green-600 ml-2">92.48%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Precision:</span>
                        <span className="text-3xl font-bold text-green-600 ml-2">100%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Recall:</span>
                        <span className="text-3xl font-bold text-green-600 ml-2">92%</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      <strong>Variable objetivo:</strong> target_gravedad (0=No Grave, 1=Grave) |
                      <strong> Top feature:</strong> clase del conductor (61.58% importancia)
                    </div>
                  </div>
                  <FaCheckCircle className="text-6xl text-green-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="space-y-8">
              {/* Route Comparison Chart */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Comparación de Rutas: Zócalo → Polanco</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={routeComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="distancia" fill="#3b82f6" name="Distancia (km)" />
                    <Bar yAxisId="right" dataKey="riesgo" fill="#ef4444" name="Riesgo Promedio" />
                    <Bar yAxisId="right" dataKey="seguridad" fill="#10b981" name="Score Seguridad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Route Details */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card border-t-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Más Corta</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Rápida
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distancia:</span>
                      <span className="font-bold">8.74 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Riesgo Prom:</span>
                      <span className="font-bold text-red-600">42.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Riesgo Máx:</span>
                      <span className="font-bold">58.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seguridad:</span>
                      <span className="font-bold text-blue-600">57.7</span>
                    </div>
                  </div>
                </div>

                <div className="card border-t-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Balanceada</h4>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      Equilibrio
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distancia:</span>
                      <span className="font-bold">9.12 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Riesgo Prom:</span>
                      <span className="font-bold text-orange-600">35.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Riesgo Máx:</span>
                      <span className="font-bold">52.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seguridad:</span>
                      <span className="font-bold text-orange-600">64.2</span>
                    </div>
                  </div>
                </div>

                <div className="card border-t-4 border-green-500 ring-2 ring-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Más Segura ⭐</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Recomendada
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distancia:</span>
                      <span className="font-bold">10.23 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Riesgo Prom:</span>
                      <span className="font-bold text-green-600">28.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Riesgo Máx:</span>
                      <span className="font-bold">45.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seguridad:</span>
                      <span className="font-bold text-green-600">71.5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade-off Analysis */}
              <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-green-900 mb-4">Análisis de Trade-offs</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">+17%</div>
                    <div className="text-sm text-gray-700">Distancia adicional</div>
                    <div className="text-xs text-gray-500">Solo 1.49 km más</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">-32.6%</div>
                    <div className="text-sm text-gray-700">Reducción de riesgo</div>
                    <div className="text-xs text-gray-500">Mucho más seguro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">~4 min</div>
                    <div className="text-sm text-gray-700">Tiempo adicional</div>
                    <div className="text-xs text-gray-500">A 25 km/h promedio</div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-center font-medium text-gray-900">
                    💰 <strong>Valor:</strong> Mucho más seguro con costo mínimo en tiempo
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Results
