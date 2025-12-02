import express from 'express'
import { calculateRoute, getRouteComparison } from '../controllers/routingController.js'

const router = express.Router()

// POST /api/routing/calculate - Calculate route
router.post('/calculate', calculateRoute)

// POST /api/routing/compare - Compare multiple routes
router.post('/compare', getRouteComparison)

export default router
