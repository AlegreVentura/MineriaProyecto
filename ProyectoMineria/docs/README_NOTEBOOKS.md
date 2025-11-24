# Notebooks del Sistema de Ruteo Seguro CDMX

## 📚 Estructura del Proyecto

Este proyecto se divide en **notebooks modulares** que construyen un sistema completo de ruteo seguro basado en análisis de accidentes de tránsito en CDMX.

```
proceso.ipynb  (PASO 0 - Ejecutar primero)
    ↓
    Genera: - ACCIDENTES_COMBINADO_CDMX_2019_2023.csv
            - ACCIDENTES_CON_TRAMOS_2019_2023.csv
            - STATS_POR_TRAMO_2019_2023.csv
            - red_vial_cdmx.graphml
    ↓
┌────────────────────────────────────────────────────┐
│                                                    │
│  01_analisis_espacial_clustering.ipynb            │
│  (Clustering DBSCAN, Hot Spots, Moran's I)        │
│                                                    │
│  Genera: - ACCIDENTES_CON_CLUSTERING.csv           │
│          - GRID_HOTSPOTS.csv                       │
│          - mapas/mapa_clusters_dbscan.html         │
│                                                    │
└──────────────────────┬─────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────┐
│                                                    │
│  02_modelado_ml_causas.ipynb                      │
│  (Feature Selection, Decision Tree, Random        │
│   Forest, Logistic Regression, Stacking)          │
│                                                    │
│  Genera: - SCORING_RIESGO_COMPUESTO.csv            │
│          - modelos/modelo_riesgo_*.pkl             │
│          - modelos/scaler.pkl                      │
│                                                    │
└──────────────────────┬─────────────────────────────┘
                       ↓
┌────────────────────────────────────────────────────┐
│                                                    │
│  03_sistema_ruteo_zocalo_polanco.ipynb            │
│  🌟 DEMO COMPLETO: Zócalo → Polanco               │
│                                                    │
│  - Integración de 3 capas de riesgo                │
│    (histórico + clustering + ML)                   │
│  - Cálculo de 3 rutas alternativas                 │
│  - Mapa interactivo comparativo                    │
│  - Análisis de trade-offs                          │
│  - Recomendación inteligente                       │
│                                                    │
│  Genera: - mapas/mapa_rutas_zocalo_polanco.html    │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🎯 ¿Qué hace cada notebook?

### 📙 Notebook 00: Procesamiento de Datos Base
**Archivo:** `proceso.ipynb`

**Objetivo:** Limpieza, consolidación y preparación de datos de accidentes

**Flujo:**
1. **Carga de datos raw:** CSV de C5 CDMX (2019-2023)
2. **Limpieza:** Eliminación de nulos, coordenadas inválidas, duplicados
3. **Filtrado CDMX:** Solo accidentes en Ciudad de México
4. **Feature Engineering:**
   - `franja_horaria` (Madrugada/Mañana/Tarde/Noche)
   - `es_fin_de_semana`
   - `es_hora_pico`
   - `gravedad` (binario: grave/no grave)
5. **Matching con Red Vial:** Asignación de accidentes a edges del grafo OSM
6. **Estadísticas por Tramo:** Agregación de accidentes por calle

**Salidas principales:**
- `Datos combinados CDMX/ACCIDENTES_COMBINADO_CDMX_2019_2023.csv` (~78,000 registros)
- `Datos combinados CDMX/ACCIDENTES_CON_TRAMOS_2019_2023.csv` (~32,139 registros con matching)
- `Datos combinados CDMX/STATS_POR_TRAMO_2019_2023.csv` (~14,982 tramos)
- `Red vial/red_vial_cdmx.graphml` (grafo OSM con 99,728 nodos, 234,532 edges)

**Tiempo estimado:** 15-25 minutos

**⚠️ Importante:** Este notebook DEBE ejecutarse primero. Todos los demás dependen de sus salidas.

---

### 📘 Notebook 01: Análisis Espacial y Clustering
**Archivo:** `01_analisis_espacial_clustering.ipynb`

**Objetivo:** Identificar patrones espaciales de accidentes y zonas de alto riesgo

**Técnicas aplicadas:**
1. **DBSCAN (Density-Based Spatial Clustering):**
   - Parámetros: `eps=200m`, `min_samples=20`
   - Identifica "puntos negros" (clusters de alta densidad)
   - Resultado: 299 clusters, 17,178 puntos agrupados (53.4%)

2. **Getis-Ord Gi\* (Hot Spot Analysis):**
   - Crea cuadrícula de 0.01° (~1.1 km)
   - Calcula Z-scores para identificar hot spots estadísticamente significativos
   - Resultado: 13 hot spots al 99%, 17 al 95%

3. **Moran's I (Autocorrelación Espacial):**
   - Mide si los accidentes se agrupan espacialmente
   - Resultado: I = 0.6837 (p < 0.001) → **Clustering significativo**

**Índice de Riesgo por Clustering:**
```python
riesgo_cluster = 50 + 50 × (tamaño_cluster - min) / (max - min)
```
Escala: 0-100 (0 = sin cluster, 50-100 = en cluster, más alto = cluster más grande)

**Salidas:**
- `Datos combinados CDMX/ACCIDENTES_CON_CLUSTERING.csv`
- `Datos combinados CDMX/GRID_HOTSPOTS.csv`
- `mapas/mapa_clusters_dbscan.html` (visualización interactiva)

**Tiempo estimado:** 5-10 minutos

**Fórmula clave:**
```
G_i* = (Σ w_ij x_j - X̄ Σ w_ij) / (S √[(n Σ w_ij² - (Σ w_ij)²) / (n-1)])
```

---

### 📗 Notebook 02: Modelado Predictivo con ML
**Archivo:** `02_modelado_ml_causas.ipynb`

**Objetivo:** Predecir gravedad de accidentes y generar índice de riesgo ML

**Flujo completo:**

#### 1. Feature Selection Comprehensivo
- **Exploración:** 60+ columnas disponibles en el dataset
- **Pre-filtrado:** 60 → 35 columnas (eliminación de IDs, nulos >50%)
- **3 Algoritmos de Selección:**
  1. SelectKBest (F-score estadístico)
  2. RFE (Recursive Feature Elimination con Random Forest)
  3. Feature Importance (basado en árboles)
- **Votación por Consenso:** Features que aparecen en ≥2 algoritmos
- **Resultado:** ~20 features seleccionadas

#### 2. Modelos Entrenados
| Modelo | Accuracy | Uso Principal |
|--------|----------|---------------|
| **Decision Tree** | ~82% | Interpretabilidad (visualización del árbol) |
| **Random Forest** | ~87% | Performance + Feature Importance |
| **Logistic Regression** | ~78% | Baseline simple |
| **Stacking Ensemble** | ~88% | **Mejor predicción** (combina los 3 anteriores) |

#### 3. Análisis de Causas
- **Feature Importance:** Qué variables predicen mejor la gravedad
- **Curvas ROC:** Evaluación de discriminación de modelos
- **Matriz de Confusión:** Análisis de errores

#### 4. Scoring de Riesgo ML
```python
riesgo_ml = P(grave | features) × 100
```
- Probabilidad de accidente grave predicha por el modelo
- Escala: 0-100

#### 5. Índice de Riesgo Compuesto

**Fórmula FINAL (integración de las 3 capas):**
```python
riesgo_compuesto = 0.6 × riesgo_histórico + 0.1 × riesgo_cluster + 0.3 × riesgo_ml
```

**Justificación de ponderaciones:**
- **60% histórico:** Los datos reales de accidentes son el indicador más confiable
- **30% ML:** La predicción de gravedad añade contexto importante
- **10% clustering:** Complementa identificando zonas de concentración

**Salidas:**
- `Datos combinados CDMX/SCORING_RIESGO_COMPUESTO.csv` (~72,131 puntos)
  - Columnas: `latitud`, `longitud`, `riesgo_cluster`, `riesgo_ml`, `indice_riesgo_compuesto`
- `modelos/modelo_riesgo_rf.pkl`
- `modelos/scaler.pkl`

**Tiempo estimado:** 10-15 minutos

**Mejoras implementadas:**
- ✅ Feature selection de 60 columnas (antes solo usaba ~7)
- ✅ 3 algoritmos de selección con votación
- ✅ Stacking ensemble para mejor performance
- ✅ Corrección de error de matplotlib (`bronze` → hex `#CD7F32`)

---

### 📙 Notebook 03: Sistema de Ruteo - Ejemplo Práctico
**Archivo:** `03_sistema_ruteo_zocalo_polanco.ipynb`

**Objetivo:** Demostrar el sistema completo con caso de uso real

**Caso de uso:** **Ruta del Zócalo (Centro Histórico) a Polanco (Museo Soumaya)**

#### Flujo del Notebook:

**1. Carga de Datos:**
- Red vial OSM (grafo con 99,728 nodos, 234,532 edges)
- Riesgo histórico: `STATS_POR_TRAMO_2019_2023.csv`
- Riesgo clustering: `ACCIDENTES_CON_CLUSTERING.csv`
- Riesgo ML: `SCORING_RIESGO_COMPUESTO.csv`

**2. Asignación de Riesgo Compuesto a Calles:**

Función `asignar_riesgo_a_edges_completo()` integra las 3 capas:

```python
# A. Riesgo Histórico (matching exacto por IDs)
lookup_key = (edge_u, edge_v, edge_key)
riesgo_historico = stats_dict.get(lookup_key, 25)  # default: 25

# B. Riesgo Clustering + ML (búsqueda espacial con KDTree)
dist, idx = tree.query([lat_centro, lon_centro], k=1)
if dist < 0.005:  # <500m
    riesgo_clustering = df_scoring.iloc[idx]['riesgo_cluster']
    riesgo_ml = df_scoring.iloc[idx]['riesgo_ml']

# C. Combinar con ponderación
riesgo_compuesto = 0.6 × riesgo_historico + 0.1 × riesgo_clustering + 0.3 × riesgo_ml

# D. Calcular pesos para algoritmo de ruteo
peso_distancia = longitud
peso_balanceado = longitud × (1 + riesgo_compuesto/100)
peso_seguro = longitud × (1 + 2×riesgo_compuesto/100)
```

**3. Cálculo de 3 Rutas Alternativas (Dijkstra):**

| Ruta | Peso | Color | Prioriza |
|------|------|-------|----------|
| **Más Corta** | `peso_distancia` | 🔵 Azul | Mínima distancia |
| **Balanceada** | `peso_balanceado` | 🟠 Naranja | Equilibrio distancia/seguridad |
| **Más Segura** | `peso_seguro` | 🟢 Verde | Máxima seguridad |

**4. Visualizaciones:**

a) **Mapa Interactivo** (`mapas/mapa_rutas_zocalo_polanco.html`)
   - 3 rutas en colores diferentes simultáneamente
   - Leyenda embebida con métricas de cada ruta
   - Marcadores de origen/destino
   - Popups con detalles al hacer clic

b) **Tabla Comparativa:**
   ```
   Ruta          | Dist (km) | Riesgo Prom | Riesgo Máx | Segmentos | Score Seguridad
   --------------|-----------|-------------|------------|-----------|----------------
   🔵 Más Corta  | 8.74      | 42.3        | 58.1       | 67        | 57.7
   🟠 Balanceada | 9.12      | 35.8        | 52.4       | 72        | 64.2
   🟢 Más Segura | 10.23     | 28.5        | 45.7       | 81        | 71.5
   ```

c) **Perfil de Riesgo:**
   - Gráfico mostrando cómo varía el riesgo a lo largo de cada ruta
   - Zonas seguras (<30) vs peligrosas (>60) marcadas

d) **Radar Chart Multidimensional:**
   - Compara seguridad, eficiencia y estabilidad
   - Visualización polar de las 3 rutas

**5. Análisis de Trade-offs:**

```
🆚 Ruta Más Segura vs Ruta Más Corta:

   📏 Distancia adicional: 1.49 km (+17.1%)
   ⚠️  Reducción de riesgo: 13.8 puntos (32.6% más segura)
   ⏱️  Tiempo adicional estimado: ~4 minutos (a 25 km/h promedio)

🎯 RECOMENDACIÓN: Ruta Más Segura
   ✓ Reduce el riesgo en 32.6%
   ✓ Solo 1.5 km más larga (17%)
   ✓ ~4 minutos adicionales
   💰 Valor: Mucho más seguro con costo mínimo en tiempo
```

**Salidas:**
- `mapas/mapa_rutas_zocalo_polanco.html` ⭐

**Tiempo estimado:** 5-10 minutos

**Correcciones implementadas en este notebook:**
- ✅ Integración correcta de las 3 capas de riesgo (histórico + clustering + ML)
- ✅ Uso de KDTree para matching espacial eficiente
- ✅ Fórmula correcta: `0.6×histórico + 0.1×clustering + 0.3×ML`
- ✅ Matching por ID exacto para riesgo histórico
- ✅ Matching espacial para clustering + ML
- ✅ Rutas ahora son diferentes (antes todas idénticas)
- ✅ Valores de riesgo realistas (antes 0.0 en todas)

---

## 🚀 Orden de Ejecución

### ✅ Ejecución Completa (Recomendado para reproducibilidad)

```bash
1. proceso.ipynb                           # 15-25 min - Genera datos base
2. 01_analisis_espacial_clustering.ipynb   #  5-10 min - Clustering DBSCAN + Hot Spots
3. 02_modelado_ml_causas.ipynb             # 10-15 min - Feature Selection + ML
4. 03_sistema_ruteo_zocalo_polanco.ipynb   #  5-10 min - DEMO: Zócalo → Polanco ⭐
```

**Tiempo total:** ~40-60 minutos

### ⚡ Ejecución Rápida (Solo Demo)

Si ya ejecutaste `proceso.ipynb`, `01_*` y `02_*` antes:

```bash
→ 03_sistema_ruteo_zocalo_polanco.ipynb  ⭐
```

Este notebook puede ejecutarse solo porque usa los archivos ya generados.

---

## 📂 Archivos Generados por Carpeta

### `Datos combinados CDMX/`
| Archivo | Generado por | Tamaño (aprox.) | Uso |
|---------|--------------|-----------------|-----|
| `ACCIDENTES_COMBINADO_CDMX_2019_2023.csv` | proceso.ipynb | ~78K registros | Base consolidada |
| `ACCIDENTES_CON_TRAMOS_2019_2023.csv` | proceso.ipynb | ~32K registros | Con matching a OSM |
| `STATS_POR_TRAMO_2019_2023.csv` | proceso.ipynb | ~15K tramos | **Riesgo histórico** (60%) |
| `ACCIDENTES_CON_CLUSTERING.csv` | 01_clustering | ~32K puntos | **Riesgo clustering** (10%) |
| `GRID_HOTSPOTS.csv` | 01_clustering | ~755 celdas | Hot spots Getis-Ord |
| `SCORING_RIESGO_COMPUESTO.csv` | 02_ml_causas | ~72K puntos | **Riesgo ML + Compuesto** (30%) |

### `Red vial/`
| Archivo | Generado por | Descripción |
|---------|--------------|-------------|
| `red_vial_cdmx.graphml` | proceso.ipynb | Grafo OSM (99,728 nodos, 234,532 edges) |

### `modelos/`
| Archivo | Generado por | Descripción |
|---------|--------------|-------------|
| `modelo_riesgo_rf.pkl` | 02_ml_causas | Random Forest entrenado |
| `scaler.pkl` | 02_ml_causas | StandardScaler para features |

### `mapas/`
| Archivo | Generado por | Descripción |
|---------|--------------|-------------|
| `mapa_clusters_dbscan.html` | 01_clustering | Visualización de clusters DBSCAN |
| `mapa_rutas_zocalo_polanco.html` | 03_ruteo | **Mapa con 3 rutas comparativas** ⭐ |

---

## 📊 Tecnologías Utilizadas

### Análisis Espacial
- **GeoPandas:** Operaciones con geometrías
- **PySAL (libpysal, esda):** Matrices de pesos espaciales, Moran's I, Getis-Ord
- **Shapely:** Manipulación de geometrías
- **DBSCAN (scikit-learn):** Clustering espacial

### Machine Learning
- **scikit-learn:** Random Forest, Decision Tree, Logistic Regression, Stacking
- **Feature Selection:** SelectKBest, RFE, Feature Importance

### Red Vial y Ruteo
- **NetworkX:** Manipulación de grafos, algoritmo de Dijkstra
- **OSMnx:** Descarga de red vial de OpenStreetMap

### Visualización
- **Folium:** Mapas interactivos HTML
- **Matplotlib:** Gráficos estáticos
- **Seaborn:** Gráficos estadísticos

### Datos
- **Pandas:** Manipulación de DataFrames
- **NumPy:** Operaciones numéricas
- **SciPy:** KDTree para búsqueda espacial

---

## ⚠️ Notas Importantes

### Dependencias
```bash
pip install pandas numpy geopandas networkx osmnx folium matplotlib seaborn scikit-learn libpysal esda scipy
```

### Requisitos de Sistema
- **RAM:** Mínimo 8GB (recomendado 16GB para proceso.ipynb)
- **Espacio en disco:** ~500MB para datos + modelos
- **Python:** 3.8 o superior

### Problemas Comunes

**1. Error: "No module named 'esda'"**
```bash
pip install esda
```

**2. Error de Numba en Getis-Ord**
✅ Ya corregido en 01_clustering usando `permutations=0` y `p_norm`

**3. Error: "Invalid RGBA argument: 'bronze'"**
✅ Ya corregido en 02_ml_causas usando hex `#CD7F32`

**4. Rutas idénticas en notebook 03**
✅ Ya corregido - ahora integra correctamente las 3 capas de riesgo

**5. OSMnx demora mucho**
- Primera vez descarga la red (puede tardar 10-15 min)
- Se cachea automáticamente, ejecuciones posteriores son rápidas

---

## 🎯 Para Presentación/Demo

**Recomendación:** Ejecuta solo el **Notebook 03** y muestra:

1. ✅ **Mapa interactivo** con las 3 rutas en colores
2. ✅ **Tabla comparativa** con métricas clave
3. ✅ **Análisis de trade-offs** (distancia vs seguridad)
4. ✅ **Perfil de riesgo** a lo largo de las rutas
5. ✅ **Recomendación inteligente** basada en datos

**Tiempo de demo:** 5-10 minutos (muy visual e impactante)

---

## 💡 Mejoras Implementadas

### vs `funcionalidades_para_app.ipynb`:

1. **✅ Modularidad:**
   - Antes: 1 notebook gigante (177 celdas)
   - Ahora: 4 notebooks enfocados (~30-50 celdas cada uno)

2. **✅ Flujo narrativo claro:**
   - Notebook 00: "Preparación de datos"
   - Notebook 01: "¿Dónde ocurren los accidentes?"
   - Notebook 02: "¿Por qué y qué tan graves?"
   - Notebook 03: "¿Cómo usar esta info para rutas seguras?"

3. **✅ Feature Selection robusto:**
   - Antes: Solo ~7 features hardcodeadas
   - Ahora: Exploración de 60+ columnas, 3 algoritmos de selección con votación

4. **✅ Integración correcta de riesgos:**
   - Antes: Solo usaba riesgo histórico (rutas idénticas)
   - Ahora: 3 capas (histórico 60% + clustering 10% + ML 30%)

5. **✅ Ejemplo concreto:**
   - Antes: Código genérico sin caso de uso
   - Ahora: Caso real Zócalo → Polanco con visualización

6. **✅ Organización de archivos:**
   - `/mapas`: HTMLs de mapas
   - `/docs`: Documentación especializada
   - `/modelos`: Modelos entrenados

---

## 📞 Recursos Adicionales

- **[README_DATOS.md](README_DATOS.md):** Explicación detallada de las 4 carpetas de datos
- **[README_FORMULAS.ipynb](README_FORMULAS.ipynb):** Fórmulas matemáticas con LaTeX
- **[ARQUITECTURA_WEB.md](ARQUITECTURA_WEB.md):** Propuesta de arquitectura para aplicación web

---

## 🏆 Resultado Final

El **Notebook 03** demuestra un sistema funcional que:

✅ Integra datos históricos, análisis espacial y machine learning
✅ Calcula rutas alternativas con diferentes prioridades
✅ Visualiza de forma clara y comparativa
✅ Genera recomendaciones basadas en datos reales
✅ Tiene potencial de impacto directo en seguridad vial de CDMX

**Este no es solo un proyecto académico - es una herramienta práctica que puede salvar vidas.**
