// Routing calculation controller

export const calculateRoute = (req, res) => {
  try {
    const { origin, destination, routeType = 'safe' } = req.body

    // Validate input
    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Se requieren origin y destination'
      })
    }

    // Simulate route calculation
    // In production, this would call actual routing algorithm
    const routes = {
      short: {
        type: 'shortest',
        name: 'Más Corta',
        distance: 8.74,
        avgRisk: 42.3,
        maxRisk: 58.1,
        segments: 67,
        safetyScore: 57.7,
        estimatedTime: 21,
        color: 'blue',
        waypoints: [
          { lat: 19.4326, lon: -99.1332 }, // Zócalo
          { lat: 19.435, lon: -99.140 },
          { lat: 19.438, lon: -99.155 },
          { lat: 19.440, lon: -99.175 },
          { lat: 19.4406, lon: -99.2006 }  // Polanco
        ]
      },
      balanced: {
        type: 'balanced',
        name: 'Balanceada',
        distance: 9.12,
        avgRisk: 35.8,
        maxRisk: 52.4,
        segments: 72,
        safetyScore: 64.2,
        estimatedTime: 22,
        color: 'orange',
        waypoints: [
          { lat: 19.4326, lon: -99.1332 },
          { lat: 19.434, lon: -99.142 },
          { lat: 19.437, lon: -99.160 },
          { lat: 19.439, lon: -99.180 },
          { lat: 19.4406, lon: -99.2006 }
        ]
      },
      safe: {
        type: 'safest',
        name: 'Más Segura',
        distance: 10.23,
        avgRisk: 28.5,
        maxRisk: 45.7,
        segments: 81,
        safetyScore: 71.5,
        estimatedTime: 24,
        color: 'green',
        recommended: true,
        waypoints: [
          { lat: 19.4326, lon: -99.1332 },
          { lat: 19.433, lon: -99.145 },
          { lat: 19.436, lon: -99.165 },
          { lat: 19.438, lon: -99.185 },
          { lat: 19.4406, lon: -99.2006 }
        ]
      }
    }

    const selectedRoute = routes[routeType] || routes.safe

    res.status(200).json({
      origin,
      destination,
      route: selectedRoute,
      metadata: {
        algorithm: 'Dijkstra',
        riskLayers: {
          historical: 0.6,
          clustering: 0.1,
          machineLearning: 0.3
        },
        calculatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRouteComparison = (req, res) => {
  try {
    const { origin, destination } = req.body

    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Se requieren origin y destination'
      })
    }

    const comparison = {
      origin,
      destination,
      routes: {
        shortest: {
          type: 'shortest',
          name: 'Más Corta',
          distance: 8.74,
          avgRisk: 42.3,
          maxRisk: 58.1,
          safetyScore: 57.7,
          estimatedTime: 21,
          color: 'blue'
        },
        balanced: {
          type: 'balanced',
          name: 'Balanceada',
          distance: 9.12,
          avgRisk: 35.8,
          maxRisk: 52.4,
          safetyScore: 64.2,
          estimatedTime: 22,
          color: 'orange'
        },
        safest: {
          type: 'safest',
          name: 'Más Segura',
          distance: 10.23,
          avgRisk: 28.5,
          maxRisk: 45.7,
          safetyScore: 71.5,
          estimatedTime: 24,
          color: 'green',
          recommended: true
        }
      },

      tradeoffs: {
        safestVsShortest: {
          additionalDistance: 1.49,
          additionalDistancePercent: 17.0,
          riskReduction: 13.8,
          riskReductionPercent: 32.6,
          additionalTime: 3,
          additionalTimePercent: 14.3,
          recommendation: 'Ruta Más Segura',
          value: 'Reduce el riesgo en 32.6% con solo 17% más de distancia',
          worthIt: true
        },
        balancedVsShortest: {
          additionalDistance: 0.38,
          additionalDistancePercent: 4.3,
          riskReduction: 6.5,
          riskReductionPercent: 15.4,
          additionalTime: 1,
          additionalTimePercent: 4.8,
          recommendation: 'Ruta Balanceada',
          value: 'Reduce el riesgo en 15% con mínimo incremento de distancia',
          worthIt: true
        }
      },

      recommendation: {
        selectedRoute: 'safest',
        reason: 'Reduce el riesgo en 32.6% con solo 17% más de distancia (~4 minutos)',
        confidence: 'high',
        factors: [
          'Mayor reducción de riesgo promedio (-13.8 puntos)',
          'Mayor reducción de riesgo máximo (-12.4 puntos)',
          'Tiempo adicional mínimo (~4 minutos)',
          'Mejor score de seguridad (71.5 vs 57.7)'
        ]
      },

      metadata: {
        calculatedAt: new Date().toISOString(),
        algorithm: 'Dijkstra con 3 funciones de peso',
        riskFormula: '0.6×histórico + 0.1×clustering + 0.3×ML'
      }
    }

    res.status(200).json(comparison)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
