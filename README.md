# Sistema de Ruteo Seguro para CDMX

Proyecto de minería de datos para análisis integral de accidentes de tránsito en la Ciudad de México, aplicando el proceso KDD completo desde la adquisición de datos hasta el desarrollo de un sistema de ruteo inteligente.

## Descripción

Análisis de aproximadamente 78,000 accidentes de tránsito en CDMX (2019-2023) utilizando datos georreferenciados del C5 CDMX y la red vial de OpenStreetMap. El proyecto integra análisis espacial, machine learning predictivo y optimización de rutas para generar recomendaciones de seguridad vial.

## Estructura del Proyecto

### ProyectoMineria/
Notebooks de análisis y procesamiento de datos:

- **proceso.ipynb** - Notebook principal con el flujo completo de análisis
- **01_analisis_espacial_clustering.ipynb** - Identificación de puntos negros usando DBSCAN y Getis-Ord Gi*
- **02_modelado_ml_causas.ipynb** - Modelos predictivos de gravedad (Random Forest, Decision Tree, Stacking)
- **03_sistema_ruteo_zocalo_polanco.ipynb** - Sistema de ruteo con optimización Dijkstra
- **funcionalidades_para_app.ipynb** - Funciones para integración web

**Directorios:**
- `Datos raw/` - Archivos CSV originales del C5 CDMX (2019-2023)
- `Datos limpios/` - Datasets preprocesados
- `Datos combinados CDMX/` - Datos consolidados de todas las alcaldías
- `Red vial/` - Grafo de OpenStreetMap (99,728 nodos, 234,532 aristas)
- `modelos/` - Modelos de ML entrenados (Random Forest, Decision Tree)
- `mapas/` - Visualizaciones geoespaciales generadas
- `cache/` - Archivos temporales de procesamiento

### Hospitales/
Análisis de proximidad y capacidad hospitalaria:

- **mapa_accidentes_hospitales.html** - Visualización interactiva de accidentes y hospitales
- **Estados_Prioritarios.html** - Estados con mayor demanda hospitalaria
- **distancias_medias.html** - Análisis de distancias promedio accidente-hospital
- **kpi_cards.html** - Indicadores clave de rendimiento
- **prioridad_hospital_heridos_muertos.html** - Priorización por gravedad
- **Reporte_minería.pdf** - Documento de resultados y hallazgos

### WebPage/
Aplicación web interactiva con visualizaciones y sistema de ruteo en tiempo real:

**Frontend (React + Vite)**
- Interfaz moderna con Tailwind CSS y Framer Motion
- Visualizaciones interactivas con Recharts
- Componentes: Hero, Metodología KDD, Resultados, Demo de Ruteo
- Tecnologías: React 18, Vite, Tailwind CSS, Axios

**Backend (Node.js + Express)**
- API RESTful para datos del proyecto y cálculo de rutas
- Endpoints: /api/project/info, /api/data/stats, /api/routing/calculate
- Seguridad con Helmet, CORS, compresión Gzip
- Tecnologías: Express, Morgan, Compression

Ver [WebPage/README.md](WebPage/README.md) para instrucciones de instalación y uso.

## Metodologías Aplicadas

### Análisis Espacial
- **DBSCAN** - Clustering de accidentes (eps=0.005, min_samples=5)
- **Getis-Ord Gi*** - Identificación de hot spots estadísticamente significativos
- **Moran's I** - Autocorrelación espacial

### Machine Learning
- **Random Forest** - Predicción de gravedad de accidentes (Accuracy: 89.2%)
- **Decision Tree** - Modelo interpretable de causas (Accuracy: 87.5%)
- **Stacking Ensemble** - Combinación de modelos base para mayor precisión

### Optimización de Rutas
- **Algoritmo de Dijkstra** modificado con tres estrategias:
  - Ruta más corta (distancia mínima)
  - Ruta balanceada (distancia + riesgo)
  - Ruta más segura (minimización de riesgo)
- Función de riesgo basada en densidad histórica de accidentes

## Requisitos Técnicos

### Python
```
pandas >= 2.0.0
numpy >= 1.24.0
scikit-learn >= 1.3.0
osmnx >= 1.6.0
geopandas >= 0.14.0
folium >= 0.15.0
plotly >= 5.18.0
networkx >= 3.1
```

### Node.js (para WebPage)
```
Node.js >= 16.x
npm >= 8.x
```

## Instalación y Uso

### 1. Análisis de Datos (Jupyter Notebooks)

```bash
cd ProyectoMineria
jupyter notebook proceso.ipynb
```

### 2. Aplicación Web

```bash
cd WebPage

# Backend
cd backend
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## Resultados Principales

- **78,000+ accidentes** analizados en CDMX (2019-2023)
- **1,847 clusters** de accidentes identificados
- **Hot spots** con significancia estadística (p < 0.05)
- **89.2% accuracy** en predicción de gravedad
- **Sistema de ruteo** con 3 estrategias alternativas
- **Reducción estimada del 30-40%** en riesgo usando rutas seguras

## Fuentes de Datos

- **C5 CDMX** - Base Municipal de Accidentes de Tránsito Georreferenciados
  - Portal: https://datos.cdmx.gob.mx
  - Periodo: 2019-2023

- **OpenStreetMap** - Red vial de la Ciudad de México
  - Descarga: OSMnx (network_type='drive')
  - Cobertura: 16 alcaldías de CDMX

## Autores

Proyecto Final - Minería de Datos

## Licencia

Proyecto académico - Uso educativo
