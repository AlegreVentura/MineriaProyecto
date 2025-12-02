# 🌐 Sistema de Ruteo Seguro CDMX - Aplicación Web

Aplicación web completa que presenta el proyecto de análisis de accidentes de tránsito en la Ciudad de México, integrando visualizaciones interactivas, resultados y un sistema de ruteo seguro.

---

## 📋 Tabla de Contenido

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)

---

## ✨ Características

### Frontend (React + Vite)
- **Diseño Moderno y Responsivo**: Interfaz elegante con Tailwind CSS
- **Animaciones Suaves**: Usando Framer Motion para transiciones fluidas
- **Visualizaciones Interactivas**: Gráficos con Recharts
- **Navegación Intuitiva**: Single Page Application con scroll suave
- **Secciones Completas**:
  - Hero con estadísticas clave
  - Descripción del proyecto
  - Metodología KDD detallada
  - Resultados con tabs interactivos
  - Demo de ruteo con formulario
  - Conclusiones y trabajo futuro

### Backend (Node.js + Express)
- **API RESTful**: Endpoints organizados y documentados
- **Datos del Proyecto**: Información, metodología y resultados
- **Sistema de Ruteo**: Cálculo de rutas alternativas
- **Seguridad**: Headers con Helmet, CORS configurado
- **Performance**: Compresión Gzip, logging con Morgan

---

## 🛠 Tecnologías

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos utility-first
- **Framer Motion** - Librería de animaciones
- **Recharts** - Gráficos responsivos
- **React Icons** - Iconos modernos
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Helmet** - Seguridad HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **Compression** - Gzip compression

---

## 📁 Estructura del Proyecto

```
WebPage/
│
├── frontend/                   # Aplicación React
│   ├── public/                 # Archivos estáticos
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Methodology.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Demo.jsx
│   │   │   ├── Conclusions.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx             # Componente principal
│   │   ├── main.jsx            # Punto de entrada
│   │   └── index.css           # Estilos globales
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/                    # Servidor Node.js
    ├── controllers/            # Lógica de negocio
    │   ├── projectController.js
    │   ├── dataController.js
    │   └── routingController.js
    ├── routes/                 # Definición de rutas
    │   ├── projectRoutes.js
    │   ├── dataRoutes.js
    │   └── routingRoutes.js
    ├── data/                   # Datos mock (opcional)
    ├── server.js               # Servidor Express
    ├── package.json
    └── .env.example            # Variables de entorno
```

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 16.x
- **npm** >= 8.x (o yarn)

### 1. Clonar el Repositorio

```bash
cd "Proyecto Final Minería/WebPage"
```

### 2. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### 3. Instalar Dependencias del Backend

```bash
cd ../backend
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend`:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 💻 Uso

### Modo Desarrollo

#### Opción 1: Ejecutar Frontend y Backend por Separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

#### Opción 2: Ejecutar Ambos Simultáneamente (Recomendado)

Instala `concurrently` en la raíz de WebPage:

```bash
npm install -g concurrently
```

Crea un `package.json` en la raíz de WebPage:

```json
{
  "name": "ruteo-seguro-cdmx-web",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

Luego ejecuta:

```bash
npm run dev
```

### Modo Producción

#### 1. Build del Frontend

```bash
cd frontend
npm run build
```

Esto genera una carpeta `dist/` con los archivos optimizados.

#### 2. Servir el Frontend desde el Backend (Opcional)

Modifica `backend/server.js` para servir archivos estáticos:

```javascript
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// Catch-all para SPA
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  }
})
```

#### 3. Ejecutar en Producción

```bash
cd backend
npm start
```

---

## 🔌 API Endpoints

### Project Information

```
GET /api/project/info
```
Retorna información general del proyecto.

**Respuesta:**
```json
{
  "title": "Sistema de Ruteo Seguro para CDMX",
  "description": "...",
  "objectives": [...],
  "dataSources": {...},
  "components": [...]
}
```

---

```
GET /api/project/methodology
```
Retorna detalles de la metodología KDD.

**Respuesta:**
```json
{
  "kddProcess": [...],
  "techniques": {...},
  "formulas": {...}
}
```

---

```
GET /api/project/results
```
Retorna resultados y hallazgos del análisis.

**Respuesta:**
```json
{
  "generalStats": {...},
  "spatialAnalysis": {...},
  "machineLearning": {...},
  "routing": {...}
}
```

---

### Data Statistics

```
GET /api/data/stats
```
Estadísticas generales del dataset.

---

```
GET /api/data/clusters
```
Resultados del clustering DBSCAN.

---

```
GET /api/data/hotspots
```
Hot spots identificados con Getis-Ord Gi*.

---

```
GET /api/data/ml-metrics
```
Métricas de los modelos de Machine Learning.

---

### Routing

```
POST /api/routing/calculate
```
Calcula una ruta específica.

**Body:**
```json
{
  "origin": "Zócalo (Centro Histórico)",
  "destination": "Polanco (Museo Soumaya)",
  "routeType": "safe"  // "short", "balanced", "safe"
}
```

**Respuesta:**
```json
{
  "origin": "...",
  "destination": "...",
  "route": {
    "type": "safest",
    "distance": 10.23,
    "avgRisk": 28.5,
    "safetyScore": 71.5,
    "waypoints": [...]
  }
}
```

---

```
POST /api/routing/compare
```
Compara las 3 rutas alternativas.

**Body:**
```json
{
  "origin": "Zócalo",
  "destination": "Polanco"
}
```

---

### Health Check

```
GET /api/health
```
Verifica que el servidor esté funcionando.

---

## 🎨 Personalización

### Colores y Tema

Edita `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Personaliza aquí
      }
    }
  }
}
```

### Componentes

Los componentes están en `frontend/src/components/`. Cada componente es independiente y reutilizable.

---

## 📦 Despliegue

### Vercel (Frontend)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

### Heroku (Backend)

1. Crea un `Procfile` en `backend/`:
```
web: node server.js
```

2. Deploy:
```bash
cd backend
heroku create
git push heroku main
```

### Docker (Fullstack)

Crea un `Dockerfile` en la raíz de WebPage:

```dockerfile
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./public

EXPOSE 5000
CMD ["node", "server.js"]
```

Build y run:
```bash
docker build -t ruteo-seguro-cdmx .
docker run -p 5000:5000 ruteo-seguro-cdmx
```

---

## 🤝 Contribución

Este proyecto es académico, pero las mejoras son bienvenidas:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 Licencia

Proyecto académico - Minería de Datos

---

## 👥 Autores

Proyecto Final de Minería de Datos

---

## 🙏 Agradecimientos

- **C5 CDMX** - Datos abiertos de accidentes
- **OpenStreetMap** - Red vial
- **React**, **Tailwind CSS**, **Express** - Tecnologías open source

---

**⭐ DEMO LIVE:** Abre `http://localhost:3000` después de ejecutar `npm run dev`
