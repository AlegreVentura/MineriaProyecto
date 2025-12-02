import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'

// Import routes
import projectRoutes from './routes/projectRoutes.js'
import dataRoutes from './routes/dataRoutes.js'
import routingRoutes from './routes/routingRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet()) // Security headers
app.use(compression()) // Compress responses
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('dev')) // Logging
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/project', projectRoutes)
app.use('/api/data', dataRoutes)
app.use('/api/routing', routingRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Sistema de Ruteo Seguro CDMX API is running',
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Ruteo Seguro CDMX - API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      project: '/api/project',
      data: '/api/data',
      routing: '/api/routing'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚗 Sistema de Ruteo Seguro CDMX - Backend`)
  console.log(`📍 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✅ API ready at http://localhost:${PORT}`)
  console.log(`\n📊 Available endpoints:`)
  console.log(`   - GET  /api/health`)
  console.log(`   - GET  /api/project/info`)
  console.log(`   - GET  /api/data/stats`)
  console.log(`   - POST /api/routing/calculate\n`)
})

export default app
