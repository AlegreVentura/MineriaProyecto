import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'

/**
 * Mapa de Puntos Negros - Top 50 Zonas Más Peligrosas
 * DATOS REALES del análisis CDMX 2019-2023
 * Fuente: proceso.ipynb - Top 50 zonas peligrosas
 */
const BlackSpotsMap = () => {
  // Datos REALES de los Top 50 puntos negros (coordenadas de centros de celdas 200m×200m)
  const blackSpots = useMemo(() => {
    // Severidad = muertos × 10 + heridos × 2 + accidentes
    const spots = [
      { id: 1, lat: 19.480500, lng: -99.103500, accidents: 46, deaths: 8, injured: 26, severity: 178.0 },
      { id: 2, lat: 19.444500, lng: -99.139500, accidents: 49, deaths: 5, injured: 20, severity: 139.0 },
      { id: 3, lat: 19.478700, lng: -99.098100, accidents: 45, deaths: 4, injured: 15, severity: 115.0 },
      { id: 4, lat: 19.424700, lng: -99.143100, accidents: 55, deaths: 1, injured: 18, severity: 101.0 },
      { id: 5, lat: 19.413900, lng: -99.087300, accidents: 46, deaths: 1, injured: 21, severity: 98.0 },
      { id: 6, lat: 19.502100, lng: -99.117900, accidents: 40, deaths: 1, injured: 17, severity: 84.0 },
      { id: 7, lat: 19.439100, lng: -99.155700, accidents: 31, deaths: 1, injured: 21, severity: 83.0 },
      { id: 8, lat: 19.435500, lng: -99.150300, accidents: 45, deaths: 1, injured: 14, severity: 83.0 },
      { id: 9, lat: 19.467900, lng: -99.175500, accidents: 49, deaths: 0, injured: 15, severity: 79.0 },
      { id: 10, lat: 19.422900, lng: -99.166500, accidents: 41, deaths: 1, injured: 14, severity: 79.0 },
      { id: 11, lat: 19.397700, lng: -99.123300, accidents: 25, deaths: 4, injured: 7, severity: 79.0 },
      { id: 12, lat: 19.448100, lng: -99.135900, accidents: 26, deaths: 2, injured: 15, severity: 76.0 },
      { id: 13, lat: 19.379700, lng: -99.076500, accidents: 28, deaths: 3, injured: 9, severity: 76.0 },
      { id: 14, lat: 19.439100, lng: -99.139500, accidents: 29, deaths: 1, injured: 17, severity: 73.0 },
      { id: 15, lat: 19.410300, lng: -99.080100, accidents: 34, deaths: 2, injured: 9, severity: 72.0 },
      { id: 16, lat: 19.430100, lng: -99.173700, accidents: 39, deaths: 2, injured: 5, severity: 69.0 },
      { id: 17, lat: 19.424700, lng: -99.146700, accidents: 33, deaths: 1, injured: 13, severity: 69.0 },
      { id: 18, lat: 19.453500, lng: -99.130500, accidents: 33, deaths: 0, injured: 18, severity: 69.0 },
      { id: 19, lat: 19.460700, lng: -99.126900, accidents: 35, deaths: 0, injured: 17, severity: 69.0 },
      { id: 20, lat: 19.422900, lng: -99.119700, accidents: 33, deaths: 1, injured: 13, severity: 69.0 },
      { id: 21, lat: 19.331100, lng: -99.209700, accidents: 26, deaths: 3, injured: 6, severity: 68.0 },
      { id: 22, lat: 19.457100, lng: -99.144900, accidents: 28, deaths: 1, injured: 15, severity: 68.0 },
      { id: 23, lat: 19.487700, lng: -99.123300, accidents: 29, deaths: 0, injured: 19, severity: 67.0 },
      { id: 24, lat: 19.484100, lng: -99.146700, accidents: 18, deaths: 3, injured: 9, severity: 66.0 },
      { id: 25, lat: 19.419300, lng: -99.096300, accidents: 36, deaths: 0, injured: 15, severity: 66.0 },
      { id: 26, lat: 19.437300, lng: -99.146700, accidents: 23, deaths: 2, injured: 11, severity: 65.0 },
      { id: 27, lat: 19.422900, lng: -99.128700, accidents: 30, deaths: 1, injured: 12, severity: 64.0 },
      { id: 28, lat: 19.417500, lng: -99.098100, accidents: 38, deaths: 1, injured: 8, severity: 64.0 },
      { id: 29, lat: 19.203300, lng: -99.002700, accidents: 8, deaths: 3, injured: 13, severity: 64.0 },
      { id: 30, lat: 19.406700, lng: -99.155700, accidents: 27, deaths: 1, injured: 13, severity: 63.0 },
      { id: 31, lat: 19.464300, lng: -99.143100, accidents: 27, deaths: 3, injured: 3, severity: 63.0 },
      { id: 32, lat: 19.421100, lng: -99.081900, accidents: 19, deaths: 4, injured: 2, severity: 63.0 },
      { id: 33, lat: 19.449900, lng: -99.116100, accidents: 26, deaths: 0, injured: 18, severity: 62.0 },
      { id: 34, lat: 19.331100, lng: -99.211500, accidents: 26, deaths: 2, injured: 7, severity: 60.0 },
      { id: 35, lat: 19.424700, lng: -99.137700, accidents: 26, deaths: 1, injured: 12, severity: 60.0 },
      { id: 36, lat: 19.502100, lng: -99.157500, accidents: 29, deaths: 1, injured: 10, severity: 59.0 },
      { id: 37, lat: 19.304100, lng: -99.087300, accidents: 47, deaths: 0, injured: 6, severity: 59.0 },
      { id: 38, lat: 19.417500, lng: -99.078300, accidents: 39, deaths: 1, injured: 5, severity: 59.0 },
      { id: 39, lat: 19.473300, lng: -99.146700, accidents: 36, deaths: 1, injured: 6, severity: 58.0 },
      { id: 40, lat: 19.449900, lng: -99.058500, accidents: 34, deaths: 0, injured: 12, severity: 58.0 },
      { id: 41, lat: 19.457100, lng: -99.180900, accidents: 13, deaths: 3, injured: 7, severity: 57.0 },
      { id: 42, lat: 19.435500, lng: -99.170100, accidents: 47, deaths: 0, injured: 5, severity: 57.0 },
      { id: 43, lat: 19.383300, lng: -99.164700, accidents: 11, deaths: 3, injured: 8, severity: 57.0 },
      { id: 44, lat: 19.444500, lng: -99.146700, accidents: 23, deaths: 1, injured: 12, severity: 57.0 },
      { id: 45, lat: 19.451700, lng: -99.125100, accidents: 25, deaths: 1, injured: 11, severity: 57.0 },
      { id: 46, lat: 19.385100, lng: -99.157500, accidents: 30, deaths: 1, injured: 8, severity: 56.0 },
      { id: 47, lat: 19.341900, lng: -99.143100, accidents: 38, deaths: 1, injured: 4, severity: 56.0 },
      { id: 48, lat: 19.408500, lng: -99.121500, accidents: 17, deaths: 2, injured: 9, severity: 55.0 },
      { id: 49, lat: 19.372500, lng: -99.188100, accidents: 28, deaths: 2, injured: 3, severity: 54.0 },
      { id: 50, lat: 19.399500, lng: -99.184500, accidents: 46, deaths: 0, injured: 4, severity: 54.0 }
    ]

    return spots
  }, [])

  // Función para obtener color y tamaño según severidad
  const getSpotStyle = (severity, deaths) => {
    // Priorizar zonas con muertos
    if (deaths >= 5) return { color: '#7f1d1d', radius: 20, weight: 3 } // Rojo muy oscuro
    if (severity >= 100) return { color: '#dc2626', radius: 18, weight: 3 } // Rojo
    if (severity >= 70) return { color: '#ea580c', radius: 14, weight: 2 } // Naranja
    if (severity >= 60) return { color: '#f59e0b', radius: 11, weight: 2 } // Amarillo-naranja
    return { color: '#fbbf24', radius: 8, weight: 1 } // Amarillo
  }

  // Función para clasificar severidad
  const getSeverityLabel = (severity) => {
    if (severity >= 100) return 'Crítica'
    if (severity >= 70) return 'Muy Alta'
    if (severity >= 60) return 'Alta'
    return 'Media'
  }

  // Estadísticas totales
  const totalStats = useMemo(() => ({
    totalAccidents: blackSpots.reduce((sum, s) => sum + s.accidents, 0),
    totalDeaths: blackSpots.reduce((sum, s) => sum + s.deaths, 0),
    totalInjured: blackSpots.reduce((sum, s) => sum + s.injured, 0),
    avgSeverity: (blackSpots.reduce((sum, s) => sum + s.severity, 0) / blackSpots.length).toFixed(1)
  }), [blackSpots])

  return (
    <div className="space-y-6">
      {/* Estadísticas REALES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-br from-red-600 to-red-700 text-white"
        >
          <div className="text-4xl font-bold mb-1">50</div>
          <div className="text-sm opacity-90">Zonas Más Peligrosas</div>
          <div className="text-xs mt-1 opacity-75">Centros de celdas 200m×200m</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-orange-600 to-orange-700 text-white"
        >
          <div className="text-4xl font-bold mb-1">{totalStats.totalAccidents}</div>
          <div className="text-sm opacity-90">Total Accidentes</div>
          <div className="text-xs mt-1 opacity-75">{totalStats.totalDeaths} muertos, {totalStats.totalInjured} heridos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-yellow-600 to-yellow-700 text-white"
        >
          <div className="text-4xl font-bold mb-1">{blackSpots[0].severity}</div>
          <div className="text-sm opacity-90">Severidad Máxima</div>
          <div className="text-xs mt-1 opacity-75">Zona #{1} - {blackSpots[0].accidents} acc, {blackSpots[0].deaths} muertos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-purple-600 to-purple-700 text-white"
        >
          <div className="text-4xl font-bold mb-1">{totalStats.avgSeverity}</div>
          <div className="text-sm opacity-90">Severidad Promedio</div>
          <div className="text-xs mt-1 opacity-75">Fórmula: muertos×10 + heridos×2 + acc</div>
        </motion.div>
      </div>

      {/* Mapa */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Mapa de Zonas Peligrosas - Top 50 (Datos Reales 2019-2023)</h3>
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
          <MapContainer
            center={[19.4326, -99.1332]}
            zoom={11}
            className="w-full h-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {blackSpots.map((spot, idx) => {
              const style = getSpotStyle(spot.severity, spot.deaths)
              return (
                <CircleMarker
                  key={spot.id}
                  center={[spot.lat, spot.lng]}
                  radius={style.radius}
                  fillColor={style.color}
                  color="white"
                  weight={style.weight}
                  opacity={0.9}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-red-600">#{idx + 1} Zona Peligrosa</strong>
                      <div className="mt-1 text-xs text-gray-600">
                        Lat: {spot.lat.toFixed(4)}, Lng: {spot.lng.toFixed(4)}
                      </div>
                      <div className="mt-2 text-xs space-y-1">
                        <div>🚗 <strong>{spot.accidents}</strong> accidentes totales</div>
                        <div>💀 <strong>{spot.deaths}</strong> muertos</div>
                        <div>🤕 <strong>{spot.injured}</strong> heridos</div>
                        <div>⚠️ Severidad: <strong>{spot.severity}</strong> ({getSeverityLabel(spot.severity)})</div>
                      </div>
                      <div className="mt-2 text-xs bg-yellow-50 p-2 rounded">
                        <strong>Recomendación:</strong> Evitar zona especialmente en horas pico
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>

          {/* Leyenda */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
            <h4 className="font-bold text-sm mb-2">Severidad</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-900"></div>
                <span>≥5 muertos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600"></div>
                <span>≥100 (Crítica)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                <span>70-99 (Muy Alta)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>60-69 (Alta)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span>&lt;60 (Media)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Top 10 Zonas Más Peligrosas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Coordenadas</th>
                <th className="px-4 py-2 text-center">Accidentes</th>
                <th className="px-4 py-2 text-center">Muertos</th>
                <th className="px-4 py-2 text-center">Heridos</th>
                <th className="px-4 py-2 text-center">Severidad</th>
              </tr>
            </thead>
            <tbody>
              {blackSpots.slice(0, 10).map((spot, idx) => (
                <motion.tr
                  key={spot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-bold text-red-600">#{idx + 1}</td>
                  <td className="px-4 py-3 text-xs">
                    {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">{spot.accidents}</td>
                  <td className="px-4 py-3 text-center font-semibold text-red-600">{spot.deaths}</td>
                  <td className="px-4 py-3 text-center">{spot.injured}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      spot.severity >= 100 ? 'bg-red-100 text-red-800' :
                      spot.severity >= 70 ? 'bg-orange-100 text-orange-800' :
                      spot.severity >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {spot.severity}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BlackSpotsMap
