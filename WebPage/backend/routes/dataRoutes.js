import express from 'express'
import { getStats, getClusters, getHotspots, getMLMetrics } from '../controllers/dataController.js'

const router = express.Router()

// GET /api/data/stats - Get general statistics
router.get('/stats', getStats)

// GET /api/data/clusters - Get DBSCAN clustering data
router.get('/clusters', getClusters)

// GET /api/data/hotspots - Get Getis-Ord hot spots
router.get('/hotspots', getHotspots)

// GET /api/data/ml-metrics - Get ML model metrics
router.get('/ml-metrics', getMLMetrics)

export default router
