import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import 'leaflet/dist/leaflet.css'

/**
 * Timeline de Accidentes Animado
 * Muestra la evolución temporal de accidentes 2019-2023 con animación interactiva
 */
const Timeline = () => {
  const [currentPeriod, setCurrentPeriod] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Datos temporales simulados (en producción vendrían del backend)
  const temporalData = generateTemporalData()
  const periods = temporalData.map(d => d.period)

  // Auto-play animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentPeriod(prev => {
          if (prev >= periods.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 800) // Cambia cada 800ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, periods.length])

  const currentData = temporalData[currentPeriod]
  const cdmxCenter = [19.4326, -99.1332]

  // Controles
  const handlePrevious = () => {
    setCurrentPeriod(prev => Math.max(0, prev - 1))
    setIsPlaying(false)
  }

  const handleNext = () => {
    setCurrentPeriod(prev => Math.min(periods.length - 1, prev + 1))
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Color basado en densidad de accidentes
  const getHeatColor = (accidents) => {
    if (accidents > 2000) return '#dc2626' // Rojo intenso
    if (accidents > 1500) return '#f59e0b' // Naranja
    if (accidents > 1000) return '#facc15' // Amarillo
    if (accidents > 500) return '#10b981'  // Verde
    return '#3b82f6' // Azul
  }

  return (
    <div className="space-y-8">
      {/* Header con período actual */}
      <motion.div
        key={currentPeriod}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-4xl font-bold mb-2">{currentData.period}</h3>
            <p className="text-primary-100">Accidentes registrados en este período</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold">{currentData.total.toLocaleString()}</div>
              <div className="text-sm text-primary-200">Total Accidentes</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{currentData.avgPerDay}</div>
              <div className="text-sm text-primary-200">Promedio Diario</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mapa Animado */}
      <div className="card">
        <h4 className="text-2xl font-bold mb-4">Distribución Espacial - {currentData.period}</h4>
        <MapContainer
          center={cdmxCenter}
          zoom={11}
          style={{ height: '500px', width: '100%', borderRadius: '12px' }}
          className="shadow-xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <AnimatePresence>
            {currentData.hotspots.map((spot, idx) => (
              <CircleMarker
                key={`${currentPeriod}-${idx}`}
                center={[spot.lat, spot.lng]}
                radius={Math.sqrt(spot.accidents) * 0.5}
                fillColor={getHeatColor(spot.accidents)}
                color="white"
                weight={2}
                opacity={0.9}
                fillOpacity={0.7}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{spot.zone}</strong><br/>
                    Accidentes: {spot.accidents}<br/>
                    Período: {currentData.period}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </AnimatePresence>
        </MapContainer>

        {/* Leyenda de colores */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span>&gt;2000</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>1500-2000</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span>1000-1500</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>500-1000</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>&lt;500</span>
          </div>
        </div>
      </div>

      {/* Controles del Timeline */}
      <div className="card">
        <div className="space-y-6">
          {/* Slider */}
          <div>
            <input
              type="range"
              min="0"
              max={periods.length - 1}
              value={currentPeriod}
              onChange={(e) => {
                setCurrentPeriod(Number(e.target.value))
                setIsPlaying(false)
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{periods[0]}</span>
              <span>{periods[Math.floor(periods.length / 2)]}</span>
              <span>{periods[periods.length - 1]}</span>
            </div>
          </div>

          {/* Botones de control */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentPeriod === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaStepBackward /> Anterior
            </button>
            <button
              onClick={handlePlayPause}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {isPlaying ? (
                <>
                  <FaPause /> Pausar
                </>
              ) : (
                <>
                  <FaPlay /> Reproducir
                </>
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={currentPeriod === periods.length - 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente <FaStepForward />
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolución Temporal */}
      <div className="card">
        <h4 className="text-2xl font-bold mb-6">Evolución Temporal 2019-2023</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={temporalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={5}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Total Accidentes"
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="avgPerDay"
              stroke="#10b981"
              strokeWidth={2}
              name="Promedio Diario"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Indicador del período actual */}
        <div className="mt-4 text-center">
          <motion.div
            key={currentPeriod}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block bg-primary-100 text-primary-800 px-6 py-2 rounded-full font-semibold"
          >
            📍 Visualizando: {currentData.period}
          </motion.div>
        </div>
      </div>

      {/* Estadísticas por año */}
      <div className="grid md:grid-cols-5 gap-4">
        {getYearlyStats(temporalData).map((year, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`card text-center ${
              currentData.period.startsWith(year.year)
                ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                : 'bg-white'
            }`}
          >
            <div className="text-3xl font-bold mb-2">{year.year}</div>
            <div className={`text-sm ${currentData.period.startsWith(year.year) ? 'text-white' : 'text-gray-600'}`}>
              {year.total.toLocaleString()} accidentes
            </div>
            <div className={`text-xs mt-1 ${currentData.period.startsWith(year.year) ? 'text-primary-100' : 'text-gray-500'}`}>
              {year.avgPerDay} promedio/día
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/**
 * Genera datos temporales simulados (2019-2023 por trimestre)
 * En producción, estos datos vendrían del backend
 */
function generateTemporalData() {
  const data = []
  const years = [2019, 2020, 2021, 2022, 2023]
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

  // Zonas principales de CDMX
  const zones = [
    { name: 'Centro Histórico', lat: 19.4326, lng: -99.1332 },
    { name: 'Polanco', lat: 19.4350, lng: -99.1930 },
    { name: 'Santa Fe', lat: 19.3700, lng: -99.2600 },
    { name: 'Aeropuerto', lat: 19.4363, lng: -99.0721 },
    { name: 'Coyoacán', lat: 19.3467, lng: -99.1618 },
    { name: 'Insurgentes Sur', lat: 19.3600, lng: -99.1800 },
    { name: 'Periférico Norte', lat: 19.5000, lng: -99.1500 },
  ]

  years.forEach((year, yearIdx) => {
    quarters.forEach((quarter, qIdx) => {
      // Simular variación temporal
      const baseAccidents = 18000
      const yearFactor = 1 - (yearIdx * 0.08) // Reducción gradual
      const seasonalFactor = [1.1, 0.95, 1.05, 1.0][qIdx] // Variación estacional

      const total = Math.round(baseAccidents * yearFactor * seasonalFactor)
      const daysInQuarter = 90

      // Generar hotspots para este período
      const hotspots = zones.map(zone => {
        const accidents = Math.round((Math.random() * 0.5 + 0.5) * (total / zones.length))
        return {
          zone: zone.name,
          lat: zone.lat + (Math.random() - 0.5) * 0.02,
          lng: zone.lng + (Math.random() - 0.5) * 0.02,
          accidents
        }
      })

      data.push({
        period: `${year} ${quarter}`,
        year,
        quarter,
        total,
        avgPerDay: Math.round(total / daysInQuarter),
        hotspots
      })
    })
  })

  return data
}

/**
 * Calcula estadísticas agregadas por año
 */
function getYearlyStats(temporalData) {
  const years = [2019, 2020, 2021, 2022, 2023]
  return years.map(year => {
    const yearData = temporalData.filter(d => d.year === year)
    const total = yearData.reduce((sum, d) => sum + d.total, 0)
    const avgPerDay = Math.round(yearData.reduce((sum, d) => sum + d.avgPerDay, 0) / yearData.length)

    return { year, total, avgPerDay }
  })
}

export default Timeline
