import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

/**
 * Componente de mapa que muestra clusters espaciales sobre el mapa de CDMX
 * @param {Array} clusters - Array de puntos con {lat, lng, cluster, accidents}
 * @param {string} type - Tipo de visualización: 'dbscan', 'getis-ord', 'moran', 'grid'
 */
const ClusterMap = ({ clusters, type = 'dbscan', gridData = null }) => {
  // Centro de CDMX
  const cdmxCenter = [19.4326, -99.1332]

  // Colores por cluster para DBSCAN
  const clusterColors = {
    1: '#ef4444', // Rojo - Cluster 1 (Centro)
    2: '#f59e0b', // Naranja - Cluster 2 (Norte)
    3: '#10b981', // Verde - Cluster 3 (Sur)
    '-1': '#9ca3af', // Gris - Ruido
  }

  // Colores para Getis-Ord Gi*
  const getGiColor = (giScore) => {
    if (giScore > 3) return '#dc2626' // Hot spot 99%
    if (giScore > 2) return '#f59e0b' // Hot spot 95%
    if (giScore < -2) return '#3b82f6' // Cold spot
    return '#9ca3af' // No significativo
  }

  // Colores para Moran's I quadrants
  const moranColors = {
    0: '#dc2626', // HH - High-High
    1: '#3b82f6', // LH - Low-High
    2: '#10b981', // LL - Low-Low
    3: '#f59e0b', // HL - High-Low
  }

  // Colores para Grid density
  const getGridColor = (density) => {
    if (density > 1000) return '#dc2626'
    if (density > 700) return '#f59e0b'
    if (density > 400) return '#facc15'
    if (density > 200) return '#10b981'
    if (density > 50) return '#3b82f6'
    return '#d1d5db'
  }

  return (
    <MapContainer
      center={cdmxCenter}
      zoom={11}
      style={{ height: '600px', width: '100%', borderRadius: '12px' }}
      className="shadow-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Renderizar según el tipo de visualización */}
      {type === 'dbscan' && clusters && clusters.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point.lat, point.lng]}
          radius={Math.sqrt(point.accidents) * 1.2}
          fillColor={clusterColors[point.cluster] || '#9ca3af'}
          color="white"
          weight={1}
          opacity={0.8}
          fillOpacity={0.6}
        >
          <Popup>
            <div className="text-sm">
              <strong>Cluster {point.cluster === -1 ? 'Ruido' : point.cluster}</strong><br/>
              Accidentes: {point.accidents}<br/>
              Coordenadas: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {type === 'getis-ord' && clusters && clusters.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point.lat, point.lng]}
          radius={Math.abs(point.gi) * 3}
          fillColor={getGiColor(point.gi)}
          color="white"
          weight={1}
          opacity={0.8}
          fillOpacity={0.7}
        >
          <Popup>
            <div className="text-sm">
              <strong>{point.zone}</strong><br/>
              Gi* Score: {point.gi.toFixed(2)}<br/>
              Significancia: {point.significance}%<br/>
              Tipo: {point.gi > 3 ? 'Hot Spot (99%)' : point.gi > 2 ? 'Hot Spot (95%)' : point.gi < -2 ? 'Cold Spot' : 'No significativo'}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {type === 'moran' && clusters && clusters.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point.lat, point.lng]}
          radius={6}
          fillColor={moranColors[point.quadrant]}
          color="white"
          weight={1}
          opacity={0.8}
          fillOpacity={0.6}
        >
          <Popup>
            <div className="text-sm">
              <strong>Quadrante: {['HH', 'LH', 'LL', 'HL'][point.quadrant]}</strong><br/>
              Valor: {point.value?.toFixed(2)}<br/>
              Lag Espacial: {point.spatialLag?.toFixed(2)}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {type === 'grid' && gridData && gridData.map((cell, idx) => (
        <Rectangle
          key={idx}
          bounds={[
            [cell.minLat, cell.minLng],
            [cell.maxLat, cell.maxLng]
          ]}
          fillColor={getGridColor(cell.density)}
          color="#ffffff"
          weight={1}
          opacity={0.6}
          fillOpacity={0.5}
        >
          <Popup>
            <div className="text-sm">
              <strong>Celda {cell.id}</strong><br/>
              Densidad: {cell.density} accidentes<br/>
              Área: ~1.1 km²
            </div>
          </Popup>
        </Rectangle>
      ))}
    </MapContainer>
  )
}

export default ClusterMap
