import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Heatmap de Densidad de Accidentes por Hora del Día
 * Matriz: Día de la semana (Y) vs Hora del día (X)
 * DATOS REALES del análisis CDMX 2019-2023 (32,139 accidentes)
 * Fuente: proceso.ipynb
 */
const HourlyHeatmap = () => {
  // Datos REALES del análisis de accidentes CDMX 2019-2023
  const heatmapData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    // Datos reales de accidentes por día y hora (matriz 7×24)
    const realData = [
      // Lunes
      [155, 113, 105, 88, 83, 87, 154, 217, 296, 272, 252, 218, 280, 215, 241, 233, 278, 211, 221, 209, 216, 192, 171, 135],
      // Martes
      [105, 92, 74, 58, 64, 64, 144, 205, 328, 278, 258, 227, 247, 202, 277, 256, 229, 218, 230, 229, 217, 222, 176, 142],
      // Miércoles
      [104, 117, 90, 71, 59, 92, 160, 254, 298, 277, 248, 247, 241, 248, 267, 249, 254, 219, 237, 256, 224, 200, 174, 148],
      // Jueves
      [116, 90, 104, 84, 76, 96, 126, 233, 280, 269, 260, 233, 253, 213, 236, 254, 208, 229, 229, 235, 220, 197, 177, 181],
      // Viernes
      [139, 137, 99, 110, 91, 125, 143, 208, 299, 227, 253, 216, 225, 233, 247, 247, 266, 228, 227, 225, 219, 219, 208, 206],
      // Sábado
      [173, 196, 194, 203, 180, 181, 160, 154, 181, 172, 226, 206, 235, 227, 212, 211, 212, 197, 168, 181, 196, 174, 219, 169],
      // Domingo
      [171, 192, 165, 172, 203, 171, 168, 153, 167, 148, 180, 184, 216, 153, 204, 188, 182, 149, 184, 180, 176, 173, 167, 149]
    ]

    // Encontrar valores min y max para normalización
    const allValues = realData.flat()
    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)

    return days.map((day, dayIndex) => ({
      day,
      dayIndex,
      hours: realData[dayIndex].map((accidents, hourIndex) => ({
        normalized: ((accidents - minValue) / (maxValue - minValue)) * 100,
        accidents,
        hour: hourIndex
      }))
    }))
  }, [])

  // Función para obtener color según intensidad normalizada
  const getColor = (value) => {
    if (value >= 80) return 'bg-red-600'
    if (value >= 60) return 'bg-orange-500'
    if (value >= 40) return 'bg-yellow-500'
    if (value >= 20) return 'bg-green-400'
    return 'bg-blue-300'
  }

  // Encontrar hora pico global (dato real)
  const peakInfo = useMemo(() => {
    let maxAccidents = 0
    let peakDay = ''
    let peakHour = 0

    heatmapData.forEach(dayData => {
      dayData.hours.forEach(hourData => {
        if (hourData.accidents > maxAccidents) {
          maxAccidents = hourData.accidents
          peakDay = dayData.day
          peakHour = hourData.hour
        }
      })
    })

    return { day: peakDay, hour: peakHour, accidents: maxAccidents }
  }, [heatmapData])

  // Estadísticas reales por franja horaria
  const stats = {
    madrugada: { accidents: 5092, percent: 15.8, mortality: 3.91 },
    manana: { accidents: 9179, percent: 28.6, mortality: 2.11 },
    tarde: { accidents: 9590, percent: 29.8, mortality: 1.88 },
    noche: { accidents: 8278, percent: 25.8, mortality: 1.87 }
  }

  return (
    <div className="space-y-6">
      {/* Header con insights REALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-red-500 to-orange-500 text-white"
        >
          <div className="text-3xl font-bold mb-1">{peakInfo.hour}:00 hrs</div>
          <div className="text-sm opacity-90">Hora Más Peligrosa</div>
          <div className="text-xs mt-1 opacity-75">{peakInfo.day} - {peakInfo.accidents} accidentes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-yellow-500 to-orange-500 text-white"
        >
          <div className="text-3xl font-bold mb-1">{stats.tarde.percent}%</div>
          <div className="text-sm opacity-90">Tarde (12-6 PM)</div>
          <div className="text-xs mt-1 opacity-75">{stats.tarde.accidents.toLocaleString()} accidentes totales</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
        >
          <div className="text-3xl font-bold mb-1">{stats.madrugada.mortality}%</div>
          <div className="text-sm opacity-90">Mortalidad Madrugada</div>
          <div className="text-xs mt-1 opacity-75">Mayor tasa de fatalidad (0-6 AM)</div>
        </motion.div>
      </div>

      {/* Heatmap Matrix */}
      <div className="card overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">Densidad de Accidentes por Hora y Día (Datos Reales 2019-2023)</h3>

        <div className="inline-block min-w-full">
          {/* Header de horas */}
          <div className="flex">
            <div className="w-16"></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="w-8 text-center text-xs font-medium text-gray-600 mb-2">
                {i}
              </div>
            ))}
          </div>

          {/* Filas de días */}
          {heatmapData.map((dayData, idx) => (
            <motion.div
              key={dayData.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center mb-1"
            >
              <div className="w-16 text-sm font-medium text-gray-700 pr-2">
                {dayData.day}
              </div>
              {dayData.hours.map((hourData, hourIdx) => (
                <div
                  key={hourIdx}
                  className={`w-8 h-8 ${getColor(hourData.normalized)} border border-white transition-transform hover:scale-110 cursor-pointer`}
                  title={`${dayData.day} ${hourData.hour}:00 - ${hourData.accidents} accidentes`}
                  style={{ opacity: 0.3 + (hourData.normalized / 100) * 0.7 }}
                ></div>
              ))}
            </motion.div>
          ))}

          {/* Leyenda */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-300"></div>
              <span>Bajo (&lt;100)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-400"></div>
              <span>Medio-Bajo (100-150)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500"></div>
              <span>Medio (150-200)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-500"></div>
              <span>Alto (200-250)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600"></div>
              <span>Muy Alto (&gt;250)</span>
            </div>
          </div>
        </div>

        {/* Insights REALES */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-sm mb-2 text-blue-900">🌅 Patrón Entre Semana</h4>
            <p className="text-xs text-blue-800">
              Pico máximo: <strong>Martes 8:00 AM</strong> (328 accidentes).
              Hora rush matutina (7-9 AM) concentra el mayor número de accidentes en días laborales.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold text-sm mb-2 text-purple-900">🌙 Madrugada: Menor cantidad, Mayor mortalidad</h4>
            <p className="text-xs text-purple-800">
              Solo 15.8% de accidentes ocurren en madrugada (0-6 AM), pero tienen
              la <strong>mayor tasa de mortalidad: 3.91%</strong> (vs 2.11% en mañana).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HourlyHeatmap
