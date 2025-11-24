# 🌐 Arquitectura de Aplicación Web - Sistema de Ruteo Seguro CDMX

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Recomendada](#arquitectura-recomendada)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Datos a Utilizar](#datos-a-utilizar)
5. [Endpoints de la API](#endpoints-de-la-api)
6. [Stack Tecnológico Recomendado](#stack-tecnológico-recomendado)
7. [Flujo de Datos](#flujo-de-datos)
8. [Consideraciones Importantes](#consideraciones-importantes)

---

## Resumen Ejecutivo

### ¿Qué necesitas para la aplicación web?

Tu aplicación web necesitará:

1. **Backend (API REST)** - Procesar rutas y servir datos
2. **Frontend (Web App)** - Interfaz de usuario con mapa interactivo
3. **Datos precargados** - Red vial + estadísticas de riesgo
4. **Modelo ML** - Para scoring predictivo (opcional en v1)

### Arquitectura Simplificada

```
┌─────────────────┐
│   USUARIO WEB   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────────────────────┐
│   FRONTEND (React/Vue/Vanilla)  │
│   - Mapa Leaflet/Mapbox         │
│   - Formulario origen/destino   │
│   - Visualización de rutas      │
└────────┬────────────────────────┘
         │ REST API
         ▼
┌─────────────────────────────────┐
│   BACKEND API (Flask/FastAPI)   │
│   - Cálculo de rutas            │
│   - Algoritmo Dijkstra          │
│   - Scoring de riesgo           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   DATOS PRECARGADOS             │
│   - Grafo OSM (NetworkX/JSON)   │
│   - Stats por tramo (CSV/DB)    │
│   - Modelo ML (pickle)          │
└─────────────────────────────────┘
```

---

## Arquitectura Recomendada

### Opción 1: API REST + Frontend SPA (Recomendada para producción)

**Ventajas:**
- Separación clara frontend/backend
- Escalable
- Frontend puede ser puro JavaScript (sin servidor)
- Despliegue independiente

**Stack:**
- Backend: FastAPI (Python) + Uvicorn
- Frontend: React/Vue.js o Vanilla JS + Leaflet
- Datos: Grafo en memoria (NetworkX) + SQLite/PostgreSQL

### Opción 2: Aplicación Monolítica (Más simple para prototipo)

**Ventajas:**
- Todo en un solo servidor
- Más fácil de desplegar inicialmente
- Menos complejidad de configuración

**Stack:**
- Framework: Flask + Jinja2 templates
- Mapa: Leaflet.js embebido
- Datos: En memoria o SQLite

### Opción 3: Serverless (Cloud-native)

**Ventajas:**
- Sin gestión de servidores
- Escala automáticamente
- Pago por uso

**Stack:**
- Backend: AWS Lambda / Google Cloud Functions
- Frontend: Vercel / Netlify
- Datos: S3 + API Gateway

---

## Componentes del Sistema

### 1. Frontend (Interfaz de Usuario)

#### Funcionalidades necesarias:

```javascript
// Componentes principales
1. Mapa interactivo (Leaflet/Mapbox)
   - Visualización de CDMX
   - Marcadores de origen/destino
   - Dibujado de rutas (3 colores)

2. Formulario de búsqueda
   - Autocompletado de direcciones
   - Selector de origen/destino
   - Botón "Calcular rutas"

3. Panel de resultados
   - Tabla comparativa de rutas
   - Métricas (distancia, riesgo, tiempo)
   - Recomendación destacada

4. Visualizaciones adicionales
   - Perfil de riesgo (gráfica)
   - Estadísticas de la zona
   - Mapa de calor (opcional)
```

#### Tecnologías:

```html
<!-- Opción Simple: Vanilla JS -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
    <div id="map"></div>
    <form id="route-form">
        <input id="origen" placeholder="Origen">
        <input id="destino" placeholder="Destino">
        <button type="submit">Calcular Rutas</button>
    </form>
    <div id="resultados"></div>
</body>
</html>
```

```javascript
// Opción Moderna: React + TypeScript
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';

function RouteMap({ routes }) {
  return (
    <MapContainer center={[19.4326, -99.1332]} zoom={11}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {routes.map(route => (
        <Polyline
          positions={route.coordinates}
          color={route.color}
          weight={route.weight}
        />
      ))}
    </MapContainer>
  );
}
```

---

### 2. Backend (API REST)

#### Endpoints necesarios:

```python
# FastAPI example
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 1. Calcular rutas entre dos puntos
@app.post("/api/calcular-rutas")
async def calcular_rutas(request: RutaRequest):
    """
    Input: {
        "origen": {"lat": 19.4326, "lon": -99.1332},
        "destino": {"lat": 19.4406, "lon": -99.2006}
    }
    Output: [
        {
            "tipo": "mas_corta",
            "distancia_km": 8.5,
            "riesgo_promedio": 45,
            "coordenadas": [[lat, lon], ...],
            "tiempo_estimado_min": 25
        },
        { "tipo": "balanceada", ... },
        { "tipo": "mas_segura", ... }
    ]
    """
    pass

# 2. Buscar dirección (geocoding)
@app.get("/api/geocode")
async def geocode(direccion: str):
    """
    Input: "Zócalo, Ciudad de México"
    Output: {
        "nombre": "Plaza de la Constitución",
        "lat": 19.4326,
        "lon": -99.1332
    }
    """
    pass

# 3. Estadísticas de una zona
@app.get("/api/estadisticas-zona")
async def estadisticas_zona(lat: float, lon: float, radio_km: float = 1.0):
    """
    Input: lat=19.4326, lon=-99.1332, radio_km=1.0
    Output: {
        "total_accidentes": 523,
        "accidentes_graves": 78,
        "riesgo_promedio": 67,
        "hotspots": [...]
    }
    """
    pass

# 4. Obtener datos de hot spots
@app.get("/api/hotspots")
async def get_hotspots():
    """
    Output: [
        {"lat": 19.42, "lon": -99.13, "intensidad": 95, "n_accidentes": 234},
        ...
    ]
    """
    pass
```

---

## Datos a Utilizar

### ¿Qué archivos de tu proyecto necesitas?

#### ✅ ESENCIALES (Mínimo Viable)

1. **`Red vial/red_vial_cdmx.graphml`**
   - **Qué es:** Grafo de calles de CDMX
   - **Cómo usarlo:** Cargar con NetworkX
   - **Tamaño:** ~100k nodos, ~230k aristas
   - **Problema:** Muy pesado (varios MB)
   - **Solución:** Pre-procesar y simplificar

```python
# Backend: Cargar al iniciar servidor
import networkx as nx
import pickle

# Opción 1: Cargar GraphML (lento)
G = nx.read_graphml('red_vial_cdmx.graphml')

# Opción 2: Convertir a pickle (más rápido)
# Una sola vez:
with open('grafo_cdmx.pkl', 'wb') as f:
    pickle.dump(G, f)

# Luego siempre usar:
with open('grafo_cdmx.pkl', 'rb') as f:
    G = pickle.load(f)  # 10x más rápido
```

2. **`STATS_POR_TRAMO_2019_2023.csv`**
   - **Qué es:** Estadísticas de accidentes por cada calle
   - **Cómo usarlo:** Asignar riesgo a aristas del grafo
   - **Tamaño:** 14,982 tramos
   - **Formato necesario:** DataFrame o diccionario

```python
import pandas as pd

# Cargar stats
df_stats = pd.read_csv('STATS_POR_TRAMO_2019_2023.csv')

# Crear diccionario para lookup rápido
stats_dict = {}
for _, row in df_stats.iterrows():
    key = (row['u'], row['v'])
    stats_dict[key] = {
        'total_accidentes': row['total_accidentes'],
        'riesgo': row['riesgo_normalizado']  # Calcular esto
    }

# Asignar a aristas
for u, v, key, data in G.edges(keys=True, data=True):
    if (u, v) in stats_dict:
        data['riesgo'] = stats_dict[(u, v)]['riesgo']
    else:
        data['riesgo'] = 25  # Default
```

#### 🔶 IMPORTANTES (Mejorar experiencia)

3. **`ACCIDENTES_CON_CLUSTERING.csv`**
   - **Para qué:** Visualizar clusters en el mapa
   - **Uso:** Mostrar "puntos negros" como marcadores rojos

4. **`GRID_HOTSPOTS.csv`**
   - **Para qué:** Mapa de calor de zonas peligrosas
   - **Uso:** Capa de heat map en frontend

```javascript
// Frontend: Heat map con Leaflet
import HeatmapOverlay from 'leaflet-heatmap';

// Cargar desde API
const hotspots = await fetch('/api/hotspots').then(r => r.json());

// Crear heat map
const heatmapLayer = new HeatmapOverlay({
  radius: 25,
  maxOpacity: 0.8,
  scaleRadius: true
});

heatmapLayer.setData({
  max: 100,
  data: hotspots.map(h => ({
    lat: h.lat,
    lng: h.lon,
    value: h.intensidad
  }))
});
```

#### ⚡ OPCIONALES (Features avanzados)

5. **`modelos/modelo_riesgo_rf.pkl`**
   - **Para qué:** Predicción ML de gravedad
   - **Uso:** Scoring predictivo en tiempo real
   - **Problema:** Requiere features en tiempo real (hora, día, etc.)

6. **`SCORING_RIESGO_COMPUESTO.csv`**
   - **Para qué:** Índice combinado cluster + ML
   - **Uso:** Ya está pre-calculado, solo lookup

---

## Endpoints de la API

### Endpoint Principal: Calcular Rutas

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import networkx as nx
from typing import List, Dict

app = FastAPI()

class Coordenada(BaseModel):
    lat: float
    lon: float

class RutaRequest(BaseModel):
    origen: Coordenada
    destino: Coordenada
    preferencia: str = "balanceada"  # "corta", "balanceada", "segura"

class RutaResponse(BaseModel):
    tipo: str
    distancia_km: float
    riesgo_promedio: float
    riesgo_maximo: float
    tiempo_estimado_min: int
    coordenadas: List[List[float]]
    recomendada: bool

@app.post("/api/calcular-rutas", response_model=List[RutaResponse])
async def calcular_rutas(request: RutaRequest):
    try:
        # 1. Encontrar nodos más cercanos
        nodo_origen = encontrar_nodo_cercano(G, request.origen.lat, request.origen.lon)
        nodo_destino = encontrar_nodo_cercano(G, request.destino.lat, request.destino.lon)

        # 2. Calcular 3 rutas
        rutas = []

        # Ruta más corta
        ruta_corta = nx.shortest_path(G, nodo_origen, nodo_destino, weight='peso_distancia')
        rutas.append({
            "tipo": "mas_corta",
            **calcular_metricas_ruta(G, ruta_corta),
            "coordenadas": ruta_a_coordenadas(G, ruta_corta),
            "recomendada": False
        })

        # Ruta balanceada
        ruta_balanceada = nx.shortest_path(G, nodo_origen, nodo_destino, weight='peso_balanceado')
        rutas.append({
            "tipo": "balanceada",
            **calcular_metricas_ruta(G, ruta_balanceada),
            "coordenadas": ruta_a_coordenadas(G, ruta_balanceada),
            "recomendada": False
        })

        # Ruta más segura
        ruta_segura = nx.shortest_path(G, nodo_origen, nodo_destino, weight='peso_seguro')
        metricas_segura = calcular_metricas_ruta(G, ruta_segura)
        rutas.append({
            "tipo": "mas_segura",
            **metricas_segura,
            "coordenadas": ruta_a_coordenadas(G, ruta_segura),
            "recomendada": True  # Por defecto
        })

        # 3. Determinar recomendación
        rutas = aplicar_logica_recomendacion(rutas)

        return rutas

    except nx.NetworkXNoPath:
        raise HTTPException(status_code=404, detail="No se encontró ruta entre los puntos")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def encontrar_nodo_cercano(G, lat, lon):
    """Encuentra el nodo del grafo más cercano a lat/lon"""
    min_dist = float('inf')
    nodo_cercano = None

    for node in G.nodes():
        node_data = G.nodes[node]
        dist = ((node_data['y'] - lat)**2 + (node_data['x'] - lon)**2)**0.5
        if dist < min_dist:
            min_dist = dist
            nodo_cercano = node

    return nodo_cercano

def calcular_metricas_ruta(G, ruta):
    """Calcula distancia, riesgo, tiempo de una ruta"""
    distancia_total = 0
    riesgos = []

    for i in range(len(ruta) - 1):
        u, v = ruta[i], ruta[i+1]
        if G.has_edge(u, v):
            edge_data = list(G[u][v].values())[0]
            distancia_total += float(edge_data.get('length', 0))
            riesgos.append(float(edge_data.get('riesgo', 0)))

    return {
        "distancia_km": round(distancia_total / 1000, 2),
        "riesgo_promedio": round(sum(riesgos) / len(riesgos), 1) if riesgos else 0,
        "riesgo_maximo": round(max(riesgos), 1) if riesgos else 0,
        "tiempo_estimado_min": int((distancia_total / 1000) / 25 * 60)  # 25 km/h promedio
    }

def ruta_a_coordenadas(G, ruta):
    """Convierte lista de nodos a coordenadas [[lat, lon], ...]"""
    coords = []
    for nodo in ruta:
        node_data = G.nodes[nodo]
        coords.append([node_data['y'], node_data['x']])  # [lat, lon]
    return coords

def aplicar_logica_recomendacion(rutas):
    """Determina qué ruta recomendar basado en trade-offs"""
    corta = next(r for r in rutas if r['tipo'] == 'mas_corta')
    segura = next(r for r in rutas if r['tipo'] == 'mas_segura')

    diff_dist_pct = (segura['distancia_km'] - corta['distancia_km']) / corta['distancia_km'] * 100
    diff_riesgo_pct = (corta['riesgo_promedio'] - segura['riesgo_promedio']) / corta['riesgo_promedio'] * 100

    # Resetear todas
    for r in rutas:
        r['recomendada'] = False

    # Lógica de recomendación
    if diff_riesgo_pct > 20 and diff_dist_pct < 25:
        segura['recomendada'] = True
    elif diff_riesgo_pct > 10:
        next(r for r in rutas if r['tipo'] == 'balanceada')['recomendada'] = True
    else:
        corta['recomendada'] = True

    return rutas
```

---

## Stack Tecnológico Recomendado

### Backend: FastAPI

**¿Por qué FastAPI?**
- Rápido (basado en Starlette + Pydantic)
- Documentación automática (Swagger UI)
- Type hints nativos
- Async nativo (si lo necesitas)

```bash
# Instalación
pip install fastapi uvicorn networkx pandas numpy

# Correr servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend: Opciones

#### Opción A: Vanilla JS + Leaflet (Más simple)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ruteo Seguro CDMX</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        #map { height: 600px; }
        .resultado { margin: 10px; padding: 10px; border: 1px solid #ccc; }
        .recomendada { border: 3px solid green; }
    </style>
</head>
<body>
    <h1>Sistema de Ruteo Seguro - CDMX</h1>

    <div id="form-container">
        <input type="text" id="origen" placeholder="Origen (lat, lon)">
        <input type="text" id="destino" placeholder="Destino (lat, lon)">
        <button onclick="calcularRutas()">Calcular Rutas</button>
    </div>

    <div id="map"></div>
    <div id="resultados"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

```javascript
// app.js
const map = L.map('map').setView([19.4326, -99.1332], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let rutasLayer = L.layerGroup().addTo(map);

async function calcularRutas() {
    const origen = document.getElementById('origen').value.split(',');
    const destino = document.getElementById('destino').value.split(',');

    const response = await fetch('http://localhost:8000/api/calcular-rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            origen: { lat: parseFloat(origen[0]), lon: parseFloat(origen[1]) },
            destino: { lat: parseFloat(destino[0]), lon: parseFloat(destino[1]) }
        })
    });

    const rutas = await response.json();
    mostrarRutas(rutas);
}

function mostrarRutas(rutas) {
    rutasLayer.clearLayers();

    const colores = {
        'mas_corta': 'blue',
        'balanceada': 'orange',
        'mas_segura': 'green'
    };

    rutas.forEach(ruta => {
        const polyline = L.polyline(ruta.coordenadas, {
            color: colores[ruta.tipo],
            weight: ruta.recomendada ? 6 : 4,
            opacity: 0.8
        }).bindPopup(`
            <b>${ruta.tipo.replace('_', ' ').toUpperCase()}</b><br>
            Distancia: ${ruta.distancia_km} km<br>
            Riesgo: ${ruta.riesgo_promedio}/100<br>
            Tiempo: ${ruta.tiempo_estimado_min} min
        `);

        rutasLayer.addLayer(polyline);
    });

    mostrarResultadosTabla(rutas);
}

function mostrarResultadosTabla(rutas) {
    const container = document.getElementById('resultados');
    container.innerHTML = '<h2>Comparación de Rutas</h2>';

    rutas.forEach(ruta => {
        const div = document.createElement('div');
        div.className = 'resultado' + (ruta.recomendada ? ' recomendada' : '');
        div.innerHTML = `
            <h3>${ruta.tipo.replace('_', ' ')} ${ruta.recomendada ? '⭐' : ''}</h3>
            <p>Distancia: <b>${ruta.distancia_km} km</b></p>
            <p>Riesgo promedio: <b>${ruta.riesgo_promedio}/100</b></p>
            <p>Tiempo estimado: <b>${ruta.tiempo_estimado_min} min</b></p>
        `;
        container.appendChild(div);
    });
}
```

#### Opción B: React (Más escalable)

```bash
npx create-react-app ruteo-seguro-cdmx
cd ruteo-seguro-cdmx
npm install leaflet react-leaflet axios
```

### Base de Datos (Opcional)

Para versión inicial: **NO necesitas BD**
- Todo en memoria (grafo + stats)
- Suficiente para <100 usuarios simultáneos

Para producción: **PostgreSQL + PostGIS**
- Almacenar grafo y stats
- Queries espaciales optimizadas
- Caché de rutas populares

---

## Flujo de Datos

### 1. Inicialización del Servidor (Una vez)

```python
# main.py
from fastapi import FastAPI
import networkx as nx
import pandas as pd
import pickle

app = FastAPI()

# CARGAR DATOS AL INICIAR (global)
print("Cargando grafo...")
with open('datos/grafo_cdmx.pkl', 'rb') as f:
    G = pickle.load(f)

print("Cargando estadísticas...")
df_stats = pd.read_csv('datos/STATS_POR_TRAMO_2019_2023.csv')

print("Asignando riesgo a aristas...")
asignar_riesgo_a_edges(G, df_stats)

print("Servidor listo!")

@app.get("/")
def root():
    return {
        "mensaje": "API de Ruteo Seguro CDMX",
        "nodos": len(G.nodes),
        "aristas": len(G.edges)
    }
```

### 2. Request del Usuario

```
Usuario ingresa:
  Origen: "Zócalo CDMX"
  Destino: "Polanco"

Frontend:
  1. Geocoding (convertir nombre → lat/lon)
  2. POST /api/calcular-rutas

Backend:
  1. Encontrar nodos cercanos en grafo
  2. Dijkstra 3 veces (pesos diferentes)
  3. Calcular métricas de cada ruta
  4. Aplicar lógica de recomendación
  5. Retornar JSON con rutas

Frontend:
  1. Recibir JSON
  2. Dibujar 3 polylines en mapa
  3. Mostrar tabla comparativa
  4. Resaltar ruta recomendada
```

---

## Consideraciones Importantes

### 🔴 Problemas que DEBES resolver

#### 1. Tamaño del Grafo

**Problema:** GraphML de ~50MB es muy pesado

**Soluciones:**

```python
# Opción A: Simplificar grafo (quitar nodos innecesarios)
G_simple = nx.Graph()
for u, v, data in G.edges(data=True):
    if 'name' in data:  # Solo calles nombradas
        G_simple.add_edge(u, v, **data)

# Opción B: Convertir a formato más ligero
import json
grafo_json = nx.node_link_data(G)
with open('grafo.json', 'w') as f:
    json.dump(grafo_json, f)

# Opción C: Usar Pickle (más rápido de cargar)
with open('grafo.pkl', 'wb') as f:
    pickle.dump(G, f)
```

#### 2. Performance de Dijkstra

**Problema:** Calcular 3 rutas puede tardar >5 segundos

**Soluciones:**

```python
# Opción A: Pre-calcular rutas populares
RUTAS_POPULARES = {
    ("zocalo", "polanco"): [...],
    ("aeropuerto", "reforma"): [...],
}

# Opción B: Limitar área de búsqueda
def dijkstra_limitado(G, origen, destino, max_dist_km=15):
    # Solo considerar nodos dentro de radio
    pass

# Opción C: Usar algoritmo A* (más rápido)
nx.astar_path(G, origen, destino, heuristic=distancia_euclidiana, weight='peso')
```

#### 3. Geocoding (Nombres → Coordenadas)

**Problema:** Usuarios escriben "Zócalo", no coordenadas

**Soluciones:**

```python
# Opción A: Usar servicio externo (Nominatim)
import requests

def geocode(direccion):
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        'q': direccion,
        'format': 'json',
        'limit': 1,
        'countrycodes': 'mx'
    }
    r = requests.get(url, params=params)
    data = r.json()
    if data:
        return float(data[0]['lat']), float(data[0]['lon'])
    return None

# Opción B: Base de datos de lugares importantes
LUGARES_CONOCIDOS = {
    "zocalo": (19.4326, -99.1332),
    "angel de la independencia": (19.4270, -99.1676),
    "polanco": (19.4406, -99.2006),
    # ... agregar más
}
```

#### 4. CORS (Frontend y Backend en dominios diferentes)

```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: solo tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 🟡 Mejoras Opcionales

1. **Caché de rutas**
   ```python
   from functools import lru_cache

   @lru_cache(maxsize=1000)
   def calcular_ruta_cached(origen_nodo, destino_nodo, tipo):
       return nx.shortest_path(...)
   ```

2. **Rate limiting**
   ```python
   from slowapi import Limiter

   limiter = Limiter(key_func=lambda: request.client.host)

   @app.post("/api/calcular-rutas")
   @limiter.limit("10/minute")
   async def calcular_rutas(...):
       pass
   ```

3. **Logging y monitoreo**
   ```python
   import logging

   logger = logging.getLogger(__name__)

   @app.post("/api/calcular-rutas")
   async def calcular_rutas(request):
       logger.info(f"Calculando ruta: {request.origen} -> {request.destino}")
       # ...
   ```

---

## Checklist de Implementación

### Fase 1: MVP (Mínimo Viable)

- [ ] Backend API con FastAPI
  - [ ] Endpoint `/api/calcular-rutas`
  - [ ] Cargar grafo en memoria
  - [ ] Implementar Dijkstra con 3 pesos
- [ ] Frontend básico
  - [ ] Mapa Leaflet
  - [ ] Formulario lat/lon
  - [ ] Dibujar 3 rutas
- [ ] Deploy local
  - [ ] Correr en localhost:8000

### Fase 2: Mejorar UX

- [ ] Geocoding (nombres de lugares)
- [ ] Autocompletado de direcciones
- [ ] Tabla comparativa de rutas
- [ ] Gráfica de perfil de riesgo
- [ ] Heat map de hot spots

### Fase 3: Producción

- [ ] Optimizar performance (caché, A*)
- [ ] Base de datos PostgreSQL
- [ ] Deploy en cloud (AWS/GCP/Vercel)
- [ ] HTTPS y dominio propio
- [ ] Monitoreo y analytics

---

## Ejemplo Completo Minimalista

### Backend (`main.py`):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import networkx as nx
import pickle

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

# Cargar grafo al iniciar
with open('grafo.pkl', 'rb') as f:
    G = pickle.load(f)

@app.post("/api/ruta")
def calcular_ruta(origen_lat: float, origen_lon: float,
                  destino_lat: float, destino_lon: float):
    # Simplificado: asume que ya sabes los nodos
    origen = f"{origen_lat},{origen_lon}"  # Buscar nodo real
    destino = f"{destino_lat},{destino_lon}"

    ruta = nx.shortest_path(G, origen, destino, weight='peso_balanceado')
    coords = [[G.nodes[n]['y'], G.nodes[n]['x']] for n in ruta]

    return {"coordenadas": coords, "distancia_km": 10.5}
```

### Frontend (`index.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>
    <div id="map" style="height: 600px"></div>
    <button onclick="calcular()">Calcular Zócalo → Polanco</button>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        const map = L.map('map').setView([19.4326, -99.1332], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        async function calcular() {
            const res = await fetch('http://localhost:8000/api/ruta?origen_lat=19.4326&origen_lon=-99.1332&destino_lat=19.4406&destino_lon=-99.2006');
            const data = await res.json();
            L.polyline(data.coordenadas, {color: 'blue'}).addTo(map);
        }
    </script>
</body>
</html>
```

---

## Próximos Pasos Recomendados

1. **Prepara los datos:**
   ```bash
   # Convertir grafo a pickle
   python convert_grafo.py
   ```

2. **Crea el backend básico:**
   ```bash
   mkdir backend
   cd backend
   pip install fastapi uvicorn networkx pandas
   # Crear main.py con endpoint básico
   uvicorn main:app --reload
   ```

3. **Crea el frontend básico:**
   ```bash
   mkdir frontend
   cd frontend
   # Crear index.html con mapa Leaflet
   python -m http.server 3000
   ```

4. **Prueba local:**
   - Backend en http://localhost:8000
   - Frontend en http://localhost:3000
   - Hacer request de prueba

5. **Itera y mejora:**
   - Agregar geocoding
   - Mejorar UI
   - Optimizar performance

---

**¿Necesitas ayuda con algún paso específico? Puedo generar el código completo para backend o frontend.**
