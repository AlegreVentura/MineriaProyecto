/**
 * Servicio de routing usando OSRM (Open Source Routing Machine)
 * Calcula rutas reales que siguen las calles de OpenStreetMap
 */

const OSRM_API = 'https://router.project-osrm.org/route/v1/driving'

/**
 * Calcula una ruta entre dos puntos usando OSRM
 * @param {Object} origin - {lat, lng}
 * @param {Object} destination - {lat, lng}
 * @param {string} profile - 'fastest', 'shortest', 'balanced'
 * @returns {Promise<Object>} Ruta con coordenadas y metadatos
 */
export const calculateRoute = async (origin, destination, profile = 'fastest') => {
  try {
    // OSRM espera lng,lat (no lat,lng)
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`

    // Parámetros de la API
    const params = new URLSearchParams({
      overview: 'full',
      geometries: 'geojson',
      steps: 'true',
      annotations: 'true',
    })

    const url = `${OSRM_API}/${coords}?${params}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No se pudo calcular la ruta')
    }

    const route = data.routes[0]

    // Convertir coordenadas de GeoJSON [lng, lat] a [lat, lng] para Leaflet
    const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]])

    // Calcular distancia en km
    const distance = (route.distance / 1000).toFixed(2)

    // Calcular duración en minutos
    const duration = Math.round(route.duration / 60)

    return {
      coordinates,
      distance,
      duration,
      geometry: route.geometry,
    }
  } catch (error) {
    console.error('Error calculando ruta:', error)
    throw error
  }
}

/**
 * Calcula las 3 rutas alternativas (rápida, balanceada, segura)
 * @param {Object} origin - {lat, lng, name}
 * @param {Object} destination - {lat, lng, name}
 * @returns {Promise<Array>} Array con 3 rutas
 */
export const calculateMultipleRoutes = async (origin, destination) => {
  try {
    // Por ahora, OSRM solo devuelve rutas por tiempo/distancia
    // Para simular diferentes rutas, usaremos waypoints intermedios

    // Ruta 1: Directa (más corta/rápida)
    const directRoute = await calculateRoute(origin, destination)

    // Para las otras rutas, agregaremos pequeñas variaciones
    // Esto es una simplificación; idealmente el backend calcularía rutas
    // con diferentes funciones de peso (incluyendo riesgo)

    // Calcular puntos intermedios para rutas alternativas
    const midLat = (origin.lat + destination.lat) / 2
    const midLng = (origin.lng + destination.lng) / 2

    // Offset para crear rutas alternativas
    const offset1 = 0.01 // ~1km
    const offset2 = 0.015 // ~1.5km

    // Waypoint 1: ligeramente al norte
    const waypoint1 = { lat: midLat + offset1, lng: midLng }

    // Waypoint 2: ligeramente al sur
    const waypoint2 = { lat: midLat - offset2, lng: midLng }

    // Calcular rutas alternativas con waypoints
    let balancedRoute, safeRoute

    try {
      balancedRoute = await calculateRouteWithWaypoint(origin, waypoint1, destination)
    } catch {
      balancedRoute = directRoute
    }

    try {
      safeRoute = await calculateRouteWithWaypoint(origin, waypoint2, destination)
    } catch {
      safeRoute = directRoute
    }

    // Obtener hora actual para cálculo de riesgo basado en tiempo
    const currentTime = new Date()

    // Simular valores de riesgo (en producción vendrían del backend)
    // Ahora incluyen peso basado en hora del día
    const shortRoute = {
      type: 'short',
      name: 'Más Corta',
      color: '#3b82f6',
      coordinates: directRoute.coordinates,
      distance: directRoute.distance,
      duration: directRoute.duration,
      risk: calculateMockRisk(directRoute.distance, 'short', currentTime),
      safety: calculateMockSafety(directRoute.distance, 'short', currentTime),
    }

    const balanced = {
      type: 'balanced',
      name: 'Balanceada',
      color: '#f59e0b',
      coordinates: balancedRoute.coordinates,
      distance: balancedRoute.distance,
      duration: balancedRoute.duration,
      risk: calculateMockRisk(balancedRoute.distance, 'balanced', currentTime),
      safety: calculateMockSafety(balancedRoute.distance, 'balanced', currentTime),
    }

    const safe = {
      type: 'safe',
      name: 'Más Segura',
      color: '#10b981',
      coordinates: safeRoute.coordinates,
      distance: safeRoute.distance,
      duration: safeRoute.duration,
      risk: calculateMockRisk(safeRoute.distance, 'safe', currentTime),
      safety: calculateMockSafety(safeRoute.distance, 'safe', currentTime),
    }

    return [shortRoute, balanced, safe]
  } catch (error) {
    console.error('Error calculando rutas múltiples:', error)
    // Retornar rutas de fallback
    return getDefaultRoutes(origin, destination)
  }
}

/**
 * Calcula una ruta con un waypoint intermedio
 */
const calculateRouteWithWaypoint = async (origin, waypoint, destination) => {
  try {
    const coords = `${origin.lng},${origin.lat};${waypoint.lng},${waypoint.lat};${destination.lng},${destination.lat}`

    const params = new URLSearchParams({
      overview: 'full',
      geometries: 'geojson',
    })

    const url = `${OSRM_API}/${coords}?${params}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No se pudo calcular la ruta con waypoint')
    }

    const route = data.routes[0]
    const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]])
    const distance = (route.distance / 1000).toFixed(2)
    const duration = Math.round(route.duration / 60)

    return { coordinates, distance, duration }
  } catch (error) {
    throw error
  }
}

/**
 * Calcula multiplicador de riesgo basado en la hora del día
 * Basado en DATOS REALES del análisis CDMX 2019-2023 (32,139 accidentes)
 * Fuente: proceso.ipynb - Matriz hora × día
 * @param {Date} time - Hora para calcular el riesgo
 * @returns {number} Multiplicador de riesgo (1.0 = normal, >1.0 = más riesgo)
 */
const getTimeBasedRiskMultiplier = (time = new Date()) => {
  const hour = time.getHours()
  const dayOfWeek = time.getDay() // 0 = Domingo, 6 = Sábado

  // Datos reales por franja horaria:
  // Madrugada (0-6): 15.8% accidentes, 3.91% mortalidad (MAYOR MORTALIDAD)
  // Mañana (6-12): 28.6% accidentes, 2.11% mortalidad
  // Tarde (12-18): 29.8% accidentes (MAYOR CANTIDAD), 1.88% mortalidad
  // Noche (18-24): 25.8% accidentes, 1.87% mortalidad

  // Madrugada (0-6 AM): BAJA cantidad pero ALTA mortalidad (3.91%)
  // Aplicar multiplicador ALTO por peligrosidad
  if (hour >= 0 && hour <= 5) {
    // Domingo en madrugada: tasa de mortalidad 3.62% (máxima de la semana)
    if (dayOfWeek === 0) {
      return 1.8  // +80% riesgo - máxima mortalidad
    }
    // Sábado en madrugada: 2.68% mortalidad
    if (dayOfWeek === 6) {
      return 1.6  // +60% riesgo
    }
    return 1.5  // +50% riesgo - alta mortalidad general en madrugada
  }

  // Hora rush matutina (7-9 AM): PICO MÁXIMO de accidentes
  // Martes 8:00 = 328 accidentes (máximo absoluto)
  if (hour >= 7 && hour <= 9) {
    // Martes es el día con más accidentes en esta franja
    if (dayOfWeek === 2) {
      return 1.4  // +40% riesgo - pico máximo
    }
    return 1.35  // +35% riesgo - hora rush general
  }

  // Mediodía (12:00-14:00): Alto tráfico
  // Lunes 12:00 = 280 accidentes
  if (hour >= 12 && hour <= 14) {
    return 1.25  // +25% riesgo
  }

  // Tarde (15:00-17:00): Mayor cantidad total (29.8%)
  if (hour >= 15 && hour <= 17) {
    return 1.2  // +20% riesgo
  }

  // Mañana tranquila (6:00, 10-11): Moderado
  if (hour === 6 || (hour >= 10 && hour <= 11)) {
    return 1.1  // +10% riesgo
  }

  // Noche (18:00-23:00): Moderado-bajo
  if (hour >= 18 && hour <= 23) {
    return 1.05  // +5% riesgo - cantidad moderada, mortalidad baja
  }

  // Otras horas: riesgo base
  return 1.0
}

/**
 * Calcula riesgo simulado basado en distancia, tipo de ruta y hora del día
 * @param {number} distance - Distancia en km
 * @param {string} type - Tipo de ruta ('short', 'balanced', 'safe')
 * @param {Date} time - Hora para calcular el riesgo (opcional, default = ahora)
 * @returns {string} Score de riesgo
 */
const calculateMockRisk = (distance, type, time = new Date()) => {
  const baseRisk = 25 + (parseFloat(distance) * 1.5)

  // Multiplicadores por tipo de ruta
  const routeMultipliers = {
    short: 1.6,      // Ruta corta usa vías principales (más tráfico, más riesgo)
    balanced: 1.3,   // Ruta balanceada evita algunas zonas peligrosas
    safe: 1.0,       // Ruta segura evita puntos negros
  }

  // Obtener multiplicador basado en hora del día
  const timeMultiplier = getTimeBasedRiskMultiplier(time)

  // Calcular riesgo final combinando todos los factores
  const finalRisk = baseRisk * routeMultipliers[type] * timeMultiplier

  return finalRisk.toFixed(1)
}

/**
 * Calcula seguridad simulada basada en el riesgo
 * @param {number} distance - Distancia en km
 * @param {string} type - Tipo de ruta
 * @param {Date} time - Hora para calcular (opcional, default = ahora)
 * @returns {string} Score de seguridad
 */
const calculateMockSafety = (distance, type, time = new Date()) => {
  const risk = parseFloat(calculateMockRisk(distance, type, time))
  // Normalizar la seguridad en escala de 0-100
  const safety = Math.max(0, Math.min(100, 100 - risk))
  return safety.toFixed(1)
}

/**
 * Rutas de fallback si OSRM falla
 */
const getDefaultRoutes = (origin, destination) => {
  // Crear una ruta simple directa como fallback
  const directCoords = [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
  ]

  const distance = calculateDistance(origin, destination)
  const currentTime = new Date()

  // Usar cálculo basado en tiempo incluso en fallback
  return [
    {
      type: 'short',
      name: 'Más Corta',
      color: '#3b82f6',
      coordinates: directCoords,
      distance: distance.toFixed(2),
      duration: Math.round(distance * 3),
      risk: calculateMockRisk(distance, 'short', currentTime),
      safety: calculateMockSafety(distance, 'short', currentTime),
    },
    {
      type: 'balanced',
      name: 'Balanceada',
      color: '#f59e0b',
      coordinates: directCoords,
      distance: (distance * 1.1).toFixed(2),
      duration: Math.round(distance * 3.3),
      risk: calculateMockRisk(distance * 1.1, 'balanced', currentTime),
      safety: calculateMockSafety(distance * 1.1, 'balanced', currentTime),
    },
    {
      type: 'safe',
      name: 'Más Segura',
      color: '#10b981',
      coordinates: directCoords,
      distance: (distance * 1.2).toFixed(2),
      duration: Math.round(distance * 3.6),
      risk: calculateMockRisk(distance * 1.2, 'safe', currentTime),
      safety: calculateMockSafety(distance * 1.2, 'safe', currentTime),
    },
  ]
}

/**
 * Calcula distancia haversine entre dos puntos
 */
const calculateDistance = (point1, point2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRad(point2.lat - point1.lat)
  const dLng = toRad(point2.lng - point1.lng)

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRad = (degrees) => degrees * (Math.PI / 180)
