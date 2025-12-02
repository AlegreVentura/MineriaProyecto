import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// Component to auto-fit map bounds to routes
const FitBounds = ({ routes }) => {
  const map = useMap()

  if (routes && routes.length > 0) {
    const allPoints = routes.flatMap(route => route.coordinates)
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  return null
}

/**
 * Componente de mapa interactivo con Leaflet
 * Muestra 3 rutas alternativas con diferentes colores
 * @param {Object} origin - Coordenadas del origen {lat, lng, name}
 * @param {Object} destination - Coordenadas del destino {lat, lng, name}
 * @param {Array} routes - Array de rutas con {type, coordinates, distance, risk, color}
 * @param {Array} waypoints - Array de objetos waypoint {lat, lng, name}
 */
const RouteMap = ({ origin, destination, routes = [], waypoints = [] }) => {
  // Centro predeterminado: Ciudad de México (Zócalo)
  const defaultCenter = origin || { lat: 19.4326, lng: -99.1332 }

  // Definir colores para cada tipo de ruta
  const routeColors = {
    short: '#3b82f6',      // Azul
    balanced: '#f59e0b',   // Naranja
    safe: '#10b981'        // Verde
  }

  // Crear iconos personalizados para origen y destino
  const originIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const waypointIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to show all routes */}
        {routes.length > 0 && <FitBounds routes={routes} />}

        {/* Render routes */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.coordinates}
            pathOptions={{
              color: routeColors[route.type] || route.color,
              weight: route.type === 'safe' ? 5 : 4,
              opacity: route.type === 'safe' ? 0.9 : 0.7,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{route.name}</strong>
                <br />
                Distancia: {route.distance} km
                <br />
                Riesgo: {route.risk}
                <br />
                Seguridad: {route.safety}
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Origin marker */}
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Origen</strong>
                <br />
                {origin.name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Destino</strong>
                <br />
                {destination.name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waypoint markers */}
        {waypoints && waypoints.map((waypoint, index) => (
          <Marker key={index} position={[waypoint.lat, waypoint.lng]} icon={waypointIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Punto de Referencia {index + 1}</strong>
                <br />
                {waypoint.name}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      {routes.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
          <h4 className="font-bold text-sm mb-2 text-gray-900">Rutas</h4>
          <div className="space-y-2">
            {routes.map((route, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-1 rounded"
                  style={{ backgroundColor: routeColors[route.type] || route.color }}
                ></div>
                <span className="text-xs text-gray-700">{route.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteMap
