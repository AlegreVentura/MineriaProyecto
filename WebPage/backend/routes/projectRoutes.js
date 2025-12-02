import express from 'express'
import { getProjectInfo, getMethodology, getResults } from '../controllers/projectController.js'

const router = express.Router()

// GET /api/project/info - Get project information
router.get('/info', getProjectInfo)

// GET /api/project/methodology - Get methodology details
router.get('/methodology', getMethodology)

// GET /api/project/results - Get results and findings
router.get('/results', getResults)

export default router
