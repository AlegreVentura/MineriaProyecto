# 🚗 Sistema de Ruteo Seguro para CDMX

## Análisis Integral de Accidentes de Tránsito (2019-2023)

**Proyecto Final de Minería de Datos**

---

## 📋 Descripción del Proyecto

Sistema completo de análisis de accidentes de tránsito en la Ciudad de México que integra:

1. **📊 Procesamiento de Datos:** Limpieza y consolidación de 1.04M accidentes (2019-2023)
2. **🗺️ Análisis Espacial:** Clustering DBSCAN, Hot Spots (Getis-Ord Gi\*), Autocorrelación (Moran's I)
3. **🤖 Machine Learning:** Predicción de gravedad con Random Forest, Decision Tree, Stacking Ensemble
4. **🛣️ Sistema de Ruteo:** Cálculo de rutas seguras usando 3 capas de riesgo (histórico + clustering + ML)

**Resultado:** Aplicación funcional de ruteo que minimiza riesgo de accidentes, con ejemplo real Zócalo → Polanco.

---

## 🏗️ Estructura del Proyecto

```
ProyectoMineria/
│
├── 📓 NOTEBOOKS PRINCIPALES
│   ├── proceso.ipynb                          # 00 - Procesamiento de datos base
│   ├── 01_analisis_espacial_clustering.ipynb  # 01 - Clustering DBSCAN + Hot Spots
│   ├── 02_modelado_ml_causas.ipynb            # 02 - ML + Feature Selection
│   ├── 03_sistema_ruteo_zocalo_polanco.ipynb  # 03 - DEMO: Ruteo Zócalo → Polanco ⭐
│   └── funcionalidades_para_app.ipynb         # Legacy notebook (177 celdas, uso interno)
│
├── 📂 DATOS
│   ├── Datos raw/                             # CSV originales C5 CDMX (2019-2023)
│   ├── Datos limpios/                         # Datos con limpieza básica por año
│   ├── Datos combinados/                      # Consolidado nacional (todas alcaldías)
│   └── Datos combinados CDMX/                 # ⭐ CDMX con feature engineering
│       ├── ACCIDENTES_COMBINADO_CDMX_2019_2023.csv    (~78K registros)
│       ├── ACCIDENTES_CON_TRAMOS_2019_2023.csv        (~32K con matching OSM)
│       ├── STATS_POR_TRAMO_2019_2023.csv              (~15K tramos, riesgo histórico)
│       ├── ACCIDENTES_CON_CLUSTERING.csv              (~32K puntos, riesgo clustering)
│       ├── GRID_HOTSPOTS.csv                          (~755 celdas, hot spots)
│       └── SCORING_RIESGO_COMPUESTO.csv               (~72K puntos, riesgo ML + compuesto)
│
├── 📁 OUTPUTS
│   ├── mapas/                                 # Visualizaciones HTML interactivas
│   │   ├── mapa_clusters_dbscan.html          (Clusters DBSCAN + Hot Spots)
│   │   └── mapa_rutas_zocalo_polanco.html     (3 rutas comparativas) ⭐
│   │
│   ├── modelos/                               # Modelos ML entrenados
│   │   ├── modelo_riesgo_rf.pkl               (Random Forest)
│   │   └── scaler.pkl                         (StandardScaler)
│   │
│   └── Red vial/
│       └── red_vial_cdmx.graphml              (Grafo OSM: 99,728 nodos, 234,532 edges)
│
├── 📚 DOCUMENTACIÓN
│   └── docs/
│       ├── README_DATOS.md                    # ⭐ Explicación de las 4 carpetas de datos
│       ├── README_NOTEBOOKS.md                # ⭐ Flujo de ejecución y detalles técnicos
│       ├── README_FORMULAS.ipynb              # ⭐ Fórmulas matemáticas con LaTeX
│       └── ARQUITECTURA_WEB.md                # Propuesta de aplicación web
│
├── 🔧 UTILIDADES
│   └── scripts_auxiliares/
│       ├── README.md
│       └── funcion_asignar_tramos_FINAL.py
│
├── .gitignore
└── README.md                                  # Este archivo
```

---

## 🚀 Inicio Rápido

### Instalación de Dependencias

```bash
pip install pandas numpy geopandas networkx osmnx folium matplotlib seaborn scikit-learn libpysal esda scipy
```

### Ejecución Completa (Reproducibilidad Total)

```bash
# 1. Procesamiento de datos base (15-25 min)
jupyter notebook proceso.ipynb

# 2. Análisis espacial y clustering (5-10 min)
jupyter notebook 01_analisis_espacial_clustering.ipynb

# 3. Machine Learning y feature selection (10-15 min)
jupyter notebook 02_modelado_ml_causas.ipynb

# 4. DEMO: Sistema de ruteo Zócalo → Polanco (5-10 min) ⭐
jupyter notebook 03_sistema_ruteo_zocalo_polanco.ipynb
```

**Tiempo total:** ~40-60 minutos

### Ejecución Rápida (Solo Demo)

Si ya ejecutaste los notebooks anteriormente:

```bash
jupyter notebook 03_sistema_ruteo_zocalo_polanco.ipynb  # ⭐ Ver resultado final
```

Abre el mapa generado en: `mapas/mapa_rutas_zocalo_polanco.html`

---

## 📊 Flujo de Datos

```
Datos raw (C5 CDMX 2019-2023)
         ↓
   [proceso.ipynb]
         ↓
    Limpieza + Filtrado CDMX + Feature Engineering
         ↓
    ACCIDENTES_COMBINADO_CDMX_2019_2023.csv
         ↓
    Matching con Red Vial OSM (OSMnx)
         ↓
    ACCIDENTES_CON_TRAMOS + STATS_POR_TRAMO
         ↓
┌────────┴────────┐
│                 │
│   [01_clustering]    [02_ml_causas]
│                 │
│  DBSCAN +       │   Feature Selection (60→20 cols)
│  Getis-Ord     │   Random Forest, Stacking
│                 │
│  ACCIDENTES_    │   SCORING_RIESGO_
│  CON_CLUSTER    │   COMPUESTO
│                 │
└────────┬────────┘
         ↓
   [03_sistema_ruteo]
         ↓
    Integración 3 Capas de Riesgo:
    - 60% Histórico (STATS_POR_TRAMO)
    - 10% Clustering (ACCIDENTES_CON_CLUSTERING)
    - 30% ML (SCORING_RIESGO_COMPUESTO)
         ↓
    Dijkstra con 3 funciones de peso
         ↓
    3 Rutas Alternativas:
    🔵 Más Corta  |  🟠 Balanceada  |  🟢 Más Segura ⭐
         ↓
    mapas/mapa_rutas_zocalo_polanco.html
```

---

## 🎯 Componentes Principales

### 1️⃣ Procesamiento de Datos (`proceso.ipynb`)

**Entrada:**
- 1.04M accidentes de tránsito (2019-2023) de todas las alcaldías del Estado de México

**Proceso:**
- Limpieza de datos (nulos, coordenadas inválidas, duplicados)
- Filtrado para Ciudad de México (~78K accidentes)
- Feature engineering: `franja_horaria`, `es_fin_de_semana`, `es_hora_pico`, `gravedad`
- Matching con red vial OSM usando nearest neighbor
- Agregación de estadísticas por tramo vial

**Salida:**
- `ACCIDENTES_COMBINADO_CDMX_2019_2023.csv` (base limpia)
- `ACCIDENTES_CON_TRAMOS_2019_2023.csv` (con matching a red vial)
- `STATS_POR_TRAMO_2019_2023.csv` (**riesgo histórico** - 60% del índice final)
- `red_vial_cdmx.graphml` (grafo OSM)

---

### 2️⃣ Análisis Espacial (`01_analisis_espacial_clustering.ipynb`)

**Técnicas Aplicadas:**

#### DBSCAN (Clustering por Densidad)
- `eps=200m`, `min_samples=20`
- **Resultado:** 299 clusters, 17,178 puntos agrupados (53.4%)
- Identifica "puntos negros" (zonas de alta concentración)

#### Getis-Ord Gi\* (Hot Spot Analysis)
- Cuadrícula de 0.01° (~1.1 km)
- Detección de hot spots estadísticamente significativos
- **Resultado:** 13 hot spots al 99%, 17 al 95%

#### Moran's I (Autocorrelación Espacial)
- **I = 0.6837** (p < 0.001)
- Clustering espacial **altamente significativo**

**Salida:**
- `ACCIDENTES_CON_CLUSTERING.csv` (**riesgo clustering** - 10% del índice final)
- `GRID_HOTSPOTS.csv` (análisis de hot spots)
- `mapas/mapa_clusters_dbscan.html` (visualización)

**Fórmula de riesgo clustering:**
```
riesgo_cluster = 50 + 50 × (tamaño_cluster - min) / (max - min)
```

---

### 3️⃣ Machine Learning (`02_modelado_ml_causas.ipynb`)

**Feature Selection Robusto:**
- Exploración de **60+ columnas** disponibles
- Pre-filtrado: 60 → 35 columnas
- **3 algoritmos de selección** con votación por consenso:
  1. SelectKBest (F-score)
  2. RFE (Recursive Feature Elimination)
  3. Feature Importance (Random Forest)
- Features seleccionadas si aparecen en ≥2 algoritmos

**Modelos Entrenados:**

| Modelo | Accuracy | Uso Principal |
|--------|----------|---------------|
| Decision Tree | ~82% | Interpretabilidad (visualización del árbol) |
| Random Forest | ~87% | Performance + Feature Importance |
| Logistic Regression | ~78% | Baseline simple |
| **Stacking Ensemble** | **~88%** | **Mejor predicción** (combina los 3) ⭐ |

**Salida:**
- `SCORING_RIESGO_COMPUESTO.csv` (**riesgo ML** - 30% del índice final)
- `modelos/modelo_riesgo_rf.pkl`
- `modelos/scaler.pkl`

**Fórmula de riesgo ML:**
```python
riesgo_ml = P(grave | features) × 100
```

---

### 4️⃣ Sistema de Ruteo (`03_sistema_ruteo_zocalo_polanco.ipynb`) ⭐

**Caso de Uso Real:** Ruta del Zócalo (Centro Histórico) a Polanco (Museo Soumaya)

**Integración de 3 Capas de Riesgo:**

```python
riesgo_compuesto = 0.6 × riesgo_histórico + 0.1 × riesgo_clustering + 0.3 × riesgo_ml
```

**Justificación de Ponderaciones:**
- **60% Histórico:** Datos reales de accidentes (más confiable)
- **30% ML:** Predicción de gravedad con contexto
- **10% Clustering:** Patrones espaciales de concentración

**Funciones de Peso para Dijkstra:**

| Ruta | Función de Peso | Color | Prioriza |
|------|-----------------|-------|----------|
| **Más Corta** | `peso = longitud` | 🔵 Azul | Mínima distancia |
| **Balanceada** | `peso = longitud × (1 + riesgo/100)` | 🟠 Naranja | Equilibrio |
| **Más Segura** | `peso = longitud × (1 + 2×riesgo/100)` | 🟢 Verde | Máxima seguridad |

**Ejemplo de Resultado:**

```
Ruta          | Dist (km) | Riesgo Prom | Riesgo Máx | Score Seguridad
--------------|-----------|-------------|------------|----------------
🔵 Más Corta  | 8.74      | 42.3        | 58.1       | 57.7
🟠 Balanceada | 9.12      | 35.8        | 52.4       | 64.2
🟢 Más Segura | 10.23     | 28.5        | 45.7       | 71.5 ⭐

🎯 RECOMENDACIÓN: Ruta Más Segura
   ✓ Reduce el riesgo en 32.6%
   ✓ Solo 1.5 km más larga (17%)
   ✓ ~4 minutos adicionales
   💰 Valor: Mucho más seguro con costo mínimo en tiempo
```

**Visualizaciones:**
- Mapa interactivo con 3 rutas superpuestas
- Perfil de riesgo a lo largo de las rutas
- Radar chart multidimensional
- Tabla comparativa de métricas

**Salida:**
- `mapas/mapa_rutas_zocalo_polanco.html` ⭐

---

## 📐 Fórmulas Matemáticas Clave

### Getis-Ord Gi\* (Hot Spots)

$$
G_i^* = \frac{\sum_j w_{ij}x_j - \bar{X} \sum_j w_{ij}}{S \sqrt{\frac{n\sum_j w_{ij}^2 - (\sum_j w_{ij})^2}{n - 1}}}
$$

### Moran's I (Autocorrelación)

$$
I = \frac{n}{\sum_i \sum_j w_{ij}} \times \frac{\sum_i \sum_j w_{ij}(x_i - \bar{x})(x_j - \bar{x})}{\sum_i (x_i - \bar{x})^2}
$$

### Índice de Riesgo Compuesto

$$
\text{riesgo\_compuesto} = 0.6 \times \text{riesgo\_histórico} + 0.1 \times \text{riesgo\_cluster} + 0.3 \times \text{riesgo\_ml}
$$

Ver [`docs/README_FORMULAS.ipynb`](docs/README_FORMULAS.ipynb) para documentación completa con LaTeX.

---

## 📊 Resultados Clave

### Clusters de Alto Riesgo
- **299 clusters identificados** con DBSCAN
- **79 hot spots estadísticamente significativos** (Getis-Ord Gi\*)
- **I = 0.6837:** Clustering espacial altamente significativo

### Factores de Riesgo Principales
Según Feature Importance (Random Forest):
1. Hora del día
2. Día de la semana
3. Mes del año
4. Alcaldía (delegación)
5. Riesgo de clustering espacial

### Rendimiento de Modelos
| Modelo | Accuracy | Precision | Recall | F1-Score |
|--------|----------|-----------|--------|----------|
| Decision Tree | 82% | 0.78 | 0.75 | 0.76 |
| Random Forest | 87% | 0.85 | 0.82 | 0.83 |
| Logistic Regression | 78% | 0.74 | 0.71 | 0.72 |
| **Stacking Ensemble** | **88%** | **0.86** | **0.84** | **0.85** |

---

## 🎨 Visualizaciones

### Mapas Interactivos (HTML)
- **mapa_clusters_dbscan.html:** Clusters DBSCAN y hot spots
- **mapa_rutas_zocalo_polanco.html:** 3 rutas comparativas con leyenda ⭐

### Gráficos Estáticos
- Perfiles de riesgo a lo largo de rutas
- Radar charts multidimensionales
- Matrices de confusión
- Feature importance
- Curvas ROC

---

## 💡 Aplicaciones Prácticas

### 1. Navegación Segura para Ciudadanos
- App móvil con ruteo que considera seguridad
- Alertas de zonas de alto riesgo en tiempo real
- Recomendaciones personalizadas según preferencia (velocidad vs seguridad)

### 2. Políticas Públicas
- Identificación de zonas prioritarias para intervención
- Diseño de campañas de prevención basadas en evidencia
- Asignación óptima de recursos de seguridad vial
- Priorización de obras de mejora vial

### 3. Análisis Predictivo
- Predicción de severidad de accidentes
- Identificación de factores de riesgo modificables
- Monitoreo de tendencias temporales
- Sistema de alertas preventivas

---

## ⚙️ Requisitos Técnicos

### Dependencias
```bash
# Core
pandas>=1.5.0
numpy>=1.23.0

# Geoespacial
geopandas>=0.12.0
shapely>=2.0.0
osmnx>=1.3.0
networkx>=2.8.0

# Machine Learning
scikit-learn>=1.2.0

# Análisis espacial estadístico
libpysal>=4.7.0
esda>=2.4.0

# Visualización
matplotlib>=3.6.0
seaborn>=0.12.0
folium>=0.14.0

# Utilidades
scipy>=1.10.0
```

### Requisitos de Sistema
- **RAM:** Mínimo 8GB (recomendado 16GB para `proceso.ipynb`)
- **Espacio en disco:** ~500MB para datos + modelos
- **Python:** 3.8 o superior
- **Sistema operativo:** Windows, Linux, macOS

---

## ⚠️ Limitaciones y Consideraciones

1. **Datos históricos:** Basado en 2019-2023, requiere actualización periódica
2. **Calidad de datos:** Depende de precisión de reportes oficiales de C5
3. **Factores externos no capturados:**
   - Clima y condiciones meteorológicas
   - Eventos especiales o manifestaciones
   - Tráfico en tiempo real
   - Estado de la infraestructura vial
4. **Desbalance de clases:** ~85% de accidentes son leves
5. **Correlación ≠ Causación:** Los modelos identifican patrones, no causas directas

---

## 🛣️ Roadmap

### Corto Plazo (3-6 meses)
- [ ] Validar modelos con datos de 2024
- [ ] Desarrollar API REST para ruteo seguro
- [ ] Crear dashboard interactivo con mapas en tiempo real
- [ ] Integrar más features contextuales (clima, eventos)

### Mediano Plazo (6-12 meses)
- [ ] Integrar datos de tráfico en tiempo real (Waze, Google Maps)
- [ ] Implementar análisis de series de tiempo
- [ ] Desarrollar app móvil iOS/Android
- [ ] Sistema de actualización automática de modelos

### Largo Plazo (1-2 años)
- [ ] Sistema de alertas predictivas push
- [ ] Integración oficial con Secretaría de Movilidad CDMX
- [ ] Modelo de aprendizaje continuo con nuevos datos
- [ ] Expansión a otras ciudades de México

---

## 📚 Documentación Adicional

- **[docs/README_DATOS.md](docs/README_DATOS.md):** Explicación detallada de las 4 carpetas de datos
- **[docs/README_NOTEBOOKS.md](docs/README_NOTEBOOKS.md):** Flujo de ejecución y detalles técnicos de cada notebook
- **[docs/README_FORMULAS.ipynb](docs/README_FORMULAS.ipynb):** Fórmulas matemáticas completas con LaTeX
- **[docs/ARQUITECTURA_WEB.md](docs/ARQUITECTURA_WEB.md):** Propuesta de arquitectura para aplicación web

---

## 👥 Autores

Proyecto desarrollado como Trabajo Final de **Minería de Datos**.

---

## 📄 Licencia

Este proyecto es de carácter **académico y de investigación**. Los datos utilizados provienen de fuentes públicas (C5 CDMX, OpenStreetMap).

---

## 🙏 Agradecimientos

- **C5 CDMX:** Por proporcionar datos abiertos de accidentes de tránsito
- **OpenStreetMap:** Por la red vial abierta de CDMX
- **Comunidad OSMnx, GeoPandas, scikit-learn:** Por las excelentes herramientas

---

## 📞 Contacto

Para más información sobre el proyecto:
- Consultar los notebooks detallados
- Revisar la documentación en `/docs`
- Explorar los mapas interactivos en `/mapas`

---

**⭐ DEMO RECOMENDADA:** Ejecuta `03_sistema_ruteo_zocalo_polanco.ipynb` y abre `mapas/mapa_rutas_zocalo_polanco.html` para ver el sistema en acción.

---

**Última actualización:** 21 de noviembre de 2025
**Versión:** 2.0 (Proyecto reorganizado y documentado)
