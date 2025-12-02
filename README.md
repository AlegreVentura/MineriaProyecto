# 🚗 Sistema de Ruteo Seguro para CDMX - Análisis Integral de Accidentes de Tránsito

## Proyecto Final de Minería de Datos

**Desarrollo completo del proyecto siguiendo el proceso KDD (Knowledge Discovery in Databases)**

---

## 📑 Tabla de Contenido

1. [Introducción y Contexto](#1-introducción-y-contexto)
2. [Proceso KDD Completo](#2-proceso-kdd-completo)
   - [2.1 Selección de Datos](#21-selección-de-datos-data-selection)
   - [2.2 Preprocesamiento](#22-preprocesamiento-data-preprocessing)
   - [2.3 Transformación](#23-transformación-data-transformation)
   - [2.4 Minería de Datos](#24-minería-de-datos-data-mining)
   - [2.5 Interpretación y Evaluación](#25-interpretación-y-evaluación-interpretationevaluation)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Fórmulas y Metodologías](#4-fórmulas-y-metodologías)
5. [Resultados y Hallazgos](#5-resultados-y-hallazgos)
6. [Implementación y Reproducibilidad](#6-implementación-y-reproducibilidad)
7. [Conclusiones y Trabajo Futuro](#7-conclusiones-y-trabajo-futuro)

---

## 1. Introducción y Contexto

### 1.1 Problema a Resolver

La Ciudad de México enfrenta una problemática crítica de seguridad vial, con miles de accidentes de tránsito anuales que resultan en pérdidas humanas y económicas significativas. Existe una necesidad urgente de:

- Identificar zonas de alto riesgo vial
- Comprender patrones espaciales y temporales de accidentes
- Predecir la gravedad de accidentes basándose en características contextuales
- Proporcionar rutas alternativas que minimicen el riesgo de accidentes

### 1.2 Objetivo General

Desarrollar un **sistema integral de análisis de accidentes de tránsito** que combine técnicas de minería de datos, análisis espacial y machine learning para:

1. Identificar patrones espaciales y temporales de accidentes
2. Predecir la gravedad de accidentes
3. Calcular rutas alternativas que optimicen la seguridad vial

### 1.3 Fuentes de Datos

- **Datos de accidentes:** Base Municipal de Accidentes de Tránsito Georreferenciados del C5 CDMX (2019-2023)
  - Fuente: Portal de Datos Abiertos del Gobierno de la Ciudad de México
  - Periodo: 5 años (2019-2023)
  - Registros totales: ~1.04M accidentes (todas las alcaldías del Estado de México)
  - Registros CDMX: ~78,000 accidentes

- **Red vial:** OpenStreetMap (OSM)
  - Descargada mediante OSMnx
  - Tipo de red: `drive` (calles vehiculares)
  - Grafo CDMX: 99,728 nodos, 234,532 aristas

### 1.4 Alcance del Proyecto

**Ámbito geográfico:** Ciudad de México (16 alcaldías)
**Periodo temporal:** 2019-2023
**Tipos de análisis:**
- Análisis espacial estadístico (DBSCAN, Getis-Ord Gi*, Moran's I)
- Machine Learning predictivo (Random Forest, Decision Tree, Stacking)
- Optimización de rutas (Dijkstra con múltiples funciones de peso)

---

## 2. Proceso KDD Completo

### 2.1 Selección de Datos (Data Selection)

#### 2.1.1 Adquisición de Datos

**Datos de Accidentes (C5 CDMX):**

Los datos se descargaron manualmente del portal de Datos Abiertos de C5 CDMX, organizados por año:

```
Datos raw/
├── 2019/ BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2019.csv
├── 2020/ BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2020.csv
├── 2021/ BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2021.csv
├── 2022/ BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2022.csv
└── 2023/ BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2023.csv
```

**Columnas originales del dataset:**

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | String | Identificador único del accidente |
| `edo` | Integer | Estado (9 = Ciudad de México) |
| `mpio` | Integer | Municipio/Alcaldía (2-17 para CDMX) |
| `anio` | Integer | Año del accidente (2019-2023) |
| `mes` | Integer | Mes (1-12) |
| `dia` | Integer | Día del mes (1-31) |
| `diasemana` | Integer | Día de la semana (0=Lunes, 6=Domingo) |
| `hora` | Integer | Hora del día (0-23) |
| `minutos` | Integer | Minutos (0-59) |
| `latitud` | Float | Coordenada latitud WGS84 |
| `longitud` | Float | Coordenada longitud WGS84 |
| `urbana` | Integer | ¿Es zona urbana? (1=Sí, 0=No) |
| `suburbana` | Integer | ¿Es zona suburbana? |
| `carretera` | Integer | ¿Es carretera? |
| `clase` | String | Clasificación del accidente |
| `tipaccid` | String | Tipo de accidente |
| `nemuerto` | Integer | Número de muertos |
| `neherido` | Integer | Número de heridos |
| `automovil` | Integer | Número de automóviles involucrados |
| `campasaj` | Integer | Número de camiones de pasajeros |
| `microbus` | Integer | Número de microbuses |
| `camioneta` | Integer | Número de camionetas |
| `bicicleta` | Integer | Número de bicicletas |
| `motocicleta` | Integer | Número de motocicletas |

**Total de registros iniciales:** 1,042,387 accidentes

**Red Vial (OpenStreetMap):**

Descarga automática mediante OSMnx:

```python
import osmnx as ox

G_cdmx = ox.graph_from_place(
    "Ciudad de Mexico, Mexico",
    network_type="drive",       # Solo calles vehiculares
    retain_all=True,            # Mantener todos los componentes
    simplify=True,              # Simplificar intersecciones
    truncate_by_edge=True       # Aristas completas
)
```

**Características del grafo:**
- **Tipo:** MultiDiGraph (dirigido, con múltiples aristas entre nodos)
- **Nodos:** 99,728 (intersecciones)
- **Aristas:** 234,532 (tramos de calle)
- **CRS:** EPSG:4326 (WGS84, lat/lon)
- **Atributos de aristas:** longitud, nombre de calle, velocidad máxima, tipo de vía

#### 2.1.2 Criterios de Selección

**Filtro geográfico:**
```python
# Seleccionar solo accidentes en Ciudad de México
df_cdmx = df_total[df_total["edo"] == 9].copy()
```

**Filtro temporal:**
- Periodo: 2019-2023 (5 años completos)
- Razón: Balance entre volumen de datos y relevancia temporal

**Filtro de calidad:**
- Coordenadas válidas (latitud, longitud no nulas)
- Coordenadas dentro del bounding box de CDMX
- Sin duplicados exactos

**Registros después de selección:** ~78,000 accidentes (CDMX)

---

### 2.2 Preprocesamiento (Data Preprocessing)

#### 2.2.1 Limpieza de Datos

**Función implementada:** `limpiar_datos(df)`

**Paso 1: Normalización de nombres de columnas**

```python
def normalizar_columnas(df):
    df.columns = (
        df.columns
        .str.lower()                 # Convertir a minúsculas
        .str.replace(' ', '_')       # Espacios → guiones bajos
        .str.strip()                 # Eliminar espacios en blanco
    )
    return df
```

**Paso 2: Eliminación de duplicados**

```python
registros_antes = len(df)
df = df.drop_duplicates()
registros_despues = len(df)
duplicados_eliminados = registros_antes - registros_despues
```

**Resultado:** ~2-5% de registros duplicados eliminados por año

**Paso 3: Tratamiento de valores nulos**

Estrategias por tipo de columna:

| Columna | Estrategia | Razón |
|---------|-----------|-------|
| `latitud`, `longitud` | Eliminar registro | Indispensables para análisis espacial |
| `hora`, `minutos` | Eliminar registro | Necesarios para análisis temporal |
| `nemuerto`, `neherido` | Imputar con 0 | Ausencia implica 0 víctimas |
| `clase`, `tipaccid` | Imputar con "DESCONOCIDO" | Preservar registros |
| Columnas de vehículos | Imputar con 0 | Ausencia implica 0 vehículos |

```python
# Eliminar registros sin coordenadas
df = df.dropna(subset=['latitud', 'longitud'])

# Eliminar registros sin tiempo
df = df.dropna(subset=['hora', 'minutos'])

# Imputar valores numéricos
columnas_numericas = ['nemuerto', 'neherido', 'automovil', 'campasaj',
                      'microbus', 'camioneta', 'bicicleta', 'motocicleta']
df[columnas_numericas] = df[columnas_numericas].fillna(0)

# Imputar valores categóricos
columnas_categoricas = ['clase', 'tipaccid']
df[columnas_categoricas] = df[columnas_categoricas].fillna("DESCONOCIDO")
```

**Paso 4: Validación de coordenadas**

```python
# Bounding box de CDMX
LAT_MIN, LAT_MAX = 19.0, 19.6
LON_MIN, LON_MAX = -99.4, -98.9

# Filtrar coordenadas válidas
df = df[
    (df['latitud'] >= LAT_MIN) & (df['latitud'] <= LAT_MAX) &
    (df['longitud'] >= LON_MIN) & (df['longitud'] <= LON_MAX)
]
```

**Paso 5: Normalización de valores categóricos**

```python
# Convertir todo a mayúsculas para uniformidad
columnas_texto = df.select_dtypes(include=['object']).columns
for col in columnas_texto:
    df[col] = df[col].str.upper().str.strip()
```

**Paso 6: Corrección de tipos de datos**

```python
# Asegurar tipos correctos
df['anio'] = df['anio'].astype(int)
df['mes'] = df['mes'].astype(int)
df['dia'] = df['dia'].astype(int)
df['hora'] = df['hora'].astype(int)
df['minutos'] = df['minutos'].astype(int)
df['latitud'] = df['latitud'].astype(float)
df['longitud'] = df['longitud'].astype(float)
```

**Resultados del preprocesamiento:**

| Métrica | Valor |
|---------|-------|
| Registros iniciales (CDMX) | 82,437 |
| Duplicados eliminados | 2,104 (2.6%) |
| Sin coordenadas | 1,873 (2.3%) |
| Coordenadas inválidas | 320 (0.4%) |
| **Registros finales limpios** | **78,140** |

#### 2.2.2 Consolidación Temporal

**Combinación de años:**

```python
# Leer y limpiar cada año
dfs_limpios = []
for año in [2019, 2020, 2021, 2022, 2023]:
    df = pd.read_csv(f'Datos raw/{año}/ACCIDENTES_{año}.csv')
    df = limpiar_datos(df)
    dfs_limpios.append(df)

# Consolidar en un solo DataFrame
df_consolidado = pd.concat(dfs_limpios, ignore_index=True)
```

**Archivo generado:**
- `Datos combinados/ACCIDENTES_COMBINADO_2019_2023.csv` (~240,000 registros)
- `Datos combinados CDMX/ACCIDENTES_COMBINADO_CDMX_2019_2023.csv` (~78,000 registros CDMX)

---

### 2.3 Transformación (Data Transformation)

#### 2.3.1 Feature Engineering Temporal

**Creación de timestamp consolidado:**

```python
df['fechahora'] = pd.to_datetime({
    'year': df['anio'],
    'month': df['mes'],
    'day': df['dia'],
    'hour': df['hora'],
    'minute': df['minutos']
}, errors='coerce')
```

**Extracción de features temporales:**

```python
# Día de la semana
df['dia_semana'] = df['fechahora'].dt.dayofweek  # 0=Lunes, 6=Domingo

# Fin de semana
df['es_fin_de_semana'] = (df['dia_semana'] >= 5).astype(int)

# Hora pico
def es_hora_pico(hora):
    """Identifica horas pico de tráfico en CDMX"""
    return (
        (7 <= hora <= 10) |   # Mañana: 7-10am
        (14 <= hora <= 16) |  # Mediodía: 2-4pm
        (18 <= hora <= 21)    # Noche: 6-9pm
    )

df['es_hora_pico'] = df['hora'].apply(es_hora_pico).astype(int)

# Franja horaria
def clasificar_franja_horaria(hora):
    if 0 <= hora < 6:
        return 'MADRUGADA'
    elif 6 <= hora < 12:
        return 'MAÑANA'
    elif 12 <= hora < 18:
        return 'TARDE'
    else:  # 18 <= hora < 24
        return 'NOCHE'

df['franja_horaria'] = df['hora'].apply(clasificar_franja_horaria)
```

**Categorización de bins horarios:**

```python
df['periodo_hora'] = pd.cut(
    df['hora'],
    bins=[-1, 5, 11, 17, 23],
    labels=['Madrugada', 'Mañana', 'Tarde', 'Noche']
)
```

#### 2.3.2 Feature Engineering de Severidad

**Índice de severidad cuantitativo:**

```python
def calcular_severidad(row):
    """
    Fórmula de severidad ponderada:
    severidad = 10 × muertos + 3 × heridos

    Justificación:
    - Cada muerte pesa 10 puntos (impacto crítico)
    - Cada herido pesa 3 puntos (impacto moderado)
    """
    return 10 * row['nemuerto'] + 3 * row['neherido']

df['severidad'] = df.apply(calcular_severidad, axis=1)
```

**Clasificación binaria de gravedad:**

```python
def binarizar_gravedad(row):
    """
    Criterios para accidente grave:
    1. Al menos 1 muerto, O
    2. 3 o más heridos
    """
    tiene_muertos = row['nemuerto'] > 0
    heridos_multiples = row['neherido'] >= 3

    return 1 if (tiene_muertos or heridos_multiples) else 0

df['gravedad'] = df.apply(binarizar_gravedad, axis=1)
```

**Clasificación categórica de severidad:**

```python
def clasificar_severidad_categorica(row):
    if row['nemuerto'] >= 1:
        return 'MUY_GRAVE'
    elif row['neherido'] >= 3:
        return 'GRAVE'
    elif row['neherido'] >= 1:
        return 'MODERADA'
    else:
        return 'LEVE'

df['severidad_cat'] = df.apply(clasificar_severidad_categorica, axis=1)
```

**Features binarios de víctimas:**

```python
df['hay_muertos'] = (df['nemuerto'] > 0).astype(int)
df['hay_heridos'] = (df['neherido'] > 0).astype(int)
df['solo_daños_materiales'] = (
    (~df['hay_muertos']) & (~df['hay_heridos'])
).astype(int)
```

**Distribución de gravedad:**

| Categoría | Registros | Porcentaje |
|-----------|-----------|------------|
| LEVE (solo daños) | 66,319 | 84.9% |
| MODERADA (1-2 heridos) | 9,374 | 12.0% |
| GRAVE (3+ heridos) | 1,879 | 2.4% |
| MUY_GRAVE (con muertos) | 568 | 0.7% |

**Desbalance de clases:** 85% leve vs 15% grave (problema común en seguridad vial)

#### 2.3.3 Matching Espacial con Red Vial OSM

**Objetivo:** Asignar cada accidente al tramo de calle (arista del grafo) más cercano.

**Paso 1: Proyección de coordenadas**

```python
import geopandas as gpd
import osmnx as ox

# Convertir DataFrame a GeoDataFrame (WGS84)
gdf_accidentes = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df['longitud'], df['latitud']),
    crs='EPSG:4326'  # WGS84
)

# Proyectar grafo a UTM para cálculos en metros
G_proj = ox.project_graph(G_cdmx)

# Convertir grafo a GeoDataFrame de aristas
edges_gdf = ox.graph_to_gdfs(G_proj, nodes=False, edges=True)

# Proyectar accidentes al mismo CRS
gdf_accidentes_proj = gdf_accidentes.to_crs(edges_gdf.crs)
```

**Paso 2: Cálculo de distancias (Nearest Neighbor)**

```python
from scipy.spatial import cKDTree

# Construir KDTree de las geometrías de aristas
def obtener_centroides_edges(edges_gdf):
    """Calcula el centroide de cada arista"""
    centroides = edges_gdf.geometry.centroid
    coords = [(geom.y, geom.x) for geom in centroides]  # (lat, lon)
    return coords

coords_edges = obtener_centroides_edges(edges_gdf)
tree = cKDTree(coords_edges)

# Para cada accidente, encontrar arista más cercana
distancias = []
indices_edges = []

for punto in gdf_accidentes_proj.geometry:
    dist, idx = tree.query([punto.y, punto.x], k=1)
    distancias.append(dist)
    indices_edges.append(idx)

# Asignar IDs de aristas
df['edge_u'] = [edges_gdf.iloc[idx].name[0] for idx in indices_edges]
df['edge_v'] = [edges_gdf.iloc[idx].name[1] for idx in indices_edges]
df['edge_key'] = [edges_gdf.iloc[idx].name[2] for idx in indices_edges]
df['distancia_edge'] = distancias
```

**Fórmula de distancia euclidiana en coordenadas proyectadas:**

$$
d(\text{metros}) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

**Paso 3: Validación del matching**

```python
# Estadísticas de calidad del matching
print(f"Distancia promedio al tramo: {df['distancia_edge'].mean():.2f} m")
print(f"Distancia máxima: {df['distancia_edge'].max():.2f} m")
print(f"% dentro de 50m: {(df['distancia_edge'] < 50).mean() * 100:.1f}%")
print(f"Tramos únicos asignados: {df.groupby(['edge_u', 'edge_v', 'edge_key']).size().shape[0]}")
```

**Resultados del matching:**
- **Distancia promedio:** 18.3 metros
- **Distancia máxima:** 247.5 metros
- **% dentro de 50m:** 87.4%
- **Tramos únicos asignados:** 14,982

**Archivo generado:**
- `ACCIDENTES_CON_TRAMOS_2019_2023.csv` (32,139 registros con matching exitoso)

#### 2.3.4 Agregación por Tramo Vial

**Estadísticas por tramo:**

```python
def calcular_stats_por_tramo(df_con_tramos):
    """
    Agrega estadísticas de accidentes por cada tramo (u, v, key)
    """
    stats = df_con_tramos.groupby(['edge_u', 'edge_v', 'edge_key']).agg(
        # Conteos
        accidentes_totales=('id', 'size'),
        accidentes_graves=('gravedad', 'sum'),

        # Severidad
        severidad_total=('severidad', 'sum'),
        severidad_promedio=('severidad', 'mean'),

        # Víctimas
        muertos_totales=('nemuerto', 'sum'),
        heridos_totales=('neherido', 'sum'),

        # Calidad del matching
        distancia_prom_edge=('distancia_edge', 'mean'),

        # Coordenadas del centroide del tramo
        latitud_centro=('latitud', 'mean'),
        longitud_centro=('longitud', 'mean')
    ).reset_index()

    return stats

stats_tramos = calcular_stats_por_tramo(df)
```

**Normalización de riesgo histórico:**

```python
def normalizar_riesgo_historico(stats_tramos):
    """
    Normaliza el número de accidentes a escala 0-100

    Fórmula Min-Max:
    riesgo = (accidentes - min) / (max - min) × 100
    """
    min_acc = stats_tramos['accidentes_totales'].min()
    max_acc = stats_tramos['accidentes_totales'].max()

    stats_tramos['riesgo_historico'] = (
        (stats_tramos['accidentes_totales'] - min_acc) /
        (max_acc - min_acc) * 100
    )

    return stats_tramos

stats_tramos = normalizar_riesgo_historico(stats_tramos)
```

**Archivo generado:**
- `STATS_POR_TRAMO_2019_2023.csv` (14,982 tramos con estadísticas)

**Distribución de accidentes por tramo:**

| Percentil | Accidentes por tramo |
|-----------|---------------------|
| 50% (mediana) | 2 |
| 75% | 3 |
| 90% | 6 |
| 95% | 9 |
| 99% | 18 |
| Máximo | 142 |

#### 2.3.5 Transformaciones Geoespaciales

**Sistemas de coordenadas utilizados:**

| Sistema | EPSG | Uso | Características |
|---------|------|-----|-----------------|
| WGS84 | 4326 | Entrada/Salida | Lat/Lon geográficas |
| UTM Zone 14N | 32614 | Cálculos DBSCAN | Metros (proyectado) |
| Web Mercator | 3857 | Matching OSM | Metros (pseudo-mercator) |

**Conversión entre sistemas:**

```python
# WGS84 → UTM
gdf_utm = gdf_wgs84.to_crs('EPSG:32614')

# UTM → WGS84
gdf_wgs84 = gdf_utm.to_crs('EPSG:4326')
```

**Fórmula de conversión de grados a metros (aproximación para CDMX):**

$$
1° \text{ de latitud} \approx 111 \text{ km}
$$

$$
1° \text{ de longitud} \approx 111 \times \cos(\text{lat}) \text{ km} \approx 104 \text{ km en CDMX (19.4°N)}
$$

---

### 2.4 Minería de Datos (Data Mining)

#### 2.4.1 Análisis Espacial Estadístico

##### A. Clustering DBSCAN (Density-Based Spatial Clustering)

**Objetivo:** Identificar "puntos negros" (zonas de alta concentración de accidentes)

**Algoritmo:** DBSCAN (Density-Based Spatial Clustering of Applications with Noise)

**Parámetros seleccionados:**
- `eps = 200 metros` - Radio de vecindad
- `min_samples = 20` - Mínimo de puntos para formar cluster

**Implementación:**

```python
from sklearn.cluster import DBSCAN
import geopandas as gpd

# 1. Proyectar a UTM para trabajar en metros
gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df['longitud'], df['latitud']),
    crs='EPSG:4326'
)
gdf_utm = gdf.to_crs('EPSG:32614')

# 2. Extraer coordenadas X, Y
coords = [(geom.x, geom.y) for geom in gdf_utm.geometry]

# 3. Aplicar DBSCAN
dbscan = DBSCAN(eps=200, min_samples=20, metric='euclidean')
clusters = dbscan.fit_predict(coords)

# 4. Asignar etiquetas de cluster
df['cluster_dbscan'] = clusters  # -1 = ruido, 0+ = cluster ID
```

**Definiciones formales:**

- **Core point:** Punto con al menos `min_samples` vecinos dentro de `eps`
- **Border point:** Punto dentro de `eps` de un core point, pero con < `min_samples` vecinos
- **Noise:** Punto que no es ni core ni border

**Fórmula de distancia euclidiana:**

$$
\text{dist}(p, q) = \sqrt{(x_p - x_q)^2 + (y_p - y_q)^2}
$$

**Resultados:**

| Métrica | Valor |
|---------|-------|
| **Clusters identificados** | 299 |
| **Puntos en clusters** | 17,178 (53.4%) |
| **Puntos de ruido** | 14,961 (46.6%) |
| **Tamaño promedio de cluster** | 57.5 puntos |
| **Cluster más grande** | 487 puntos |

**Índice de riesgo por clustering:**

```python
def calcular_riesgo_cluster(df):
    """
    Asigna riesgo basado en el tamaño del cluster

    Fórmula:
    - Ruido (cluster_id = -1): riesgo = 0
    - En cluster: riesgo = 50 + 50 × (size - min_size) / (max_size - min_size)
    """
    # Calcular tamaños de clusters
    cluster_sizes = df[df['cluster_dbscan'] != -1].groupby('cluster_dbscan').size()

    min_size = cluster_sizes.min()
    max_size = cluster_sizes.max()

    # Mapear tamaños a riesgo
    size_to_risk = {}
    for cluster_id, size in cluster_sizes.items():
        normalized = (size - min_size) / (max_size - min_size)
        size_to_risk[cluster_id] = 50 + 50 * normalized

    # Asignar riesgo
    df['riesgo_cluster'] = df['cluster_dbscan'].map(size_to_risk).fillna(0)

    return df

df = calcular_riesgo_cluster(df)
```

**Interpretación:**
- `riesgo_cluster = 0`: Accidente aislado (no en cluster)
- `riesgo_cluster = 50`: Cluster pequeño
- `riesgo_cluster = 100`: Cluster más grande (punto negro crítico)

##### B. Hot Spot Analysis (Getis-Ord Gi*)

**Objetivo:** Identificar zonas donde la concentración de accidentes es estadísticamente significativa

**Metodología:** Análisis de cuadrícula espacial con estadística Getis-Ord Gi*

**Paso 1: Creación de cuadrícula**

```python
from shapely.geometry import box

# Tamaño de celda: 0.01° (~1.1 km)
cell_size = 0.01

# Bounding box de CDMX
minx, miny, maxx, maxy = 19.0, -99.4, 19.6, -98.9

# Generar grid
cells = []
for x in np.arange(minx, maxx, cell_size):
    for y in np.arange(miny, maxy, cell_size):
        cell = box(y, x, y + cell_size, x + cell_size)
        cells.append(cell)

grid_gdf = gpd.GeoDataFrame({'geometry': cells}, crs='EPSG:4326')
```

**Paso 2: Contar accidentes por celda**

```python
# Spatial join
gdf_accidentes = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df['longitud'], df['latitud']),
    crs='EPSG:4326'
)

joined = gpd.sjoin(grid_gdf, gdf_accidentes, how='left', predicate='contains')

# Agregación
cell_counts = joined.groupby(joined.index).agg(
    n_accidentes=('id', 'count'),
    n_graves=('gravedad', 'sum'),
    severidad_total=('severidad', 'sum')
).reset_index()

grid_gdf = grid_gdf.join(cell_counts.set_index('index'), how='left')
grid_gdf = grid_gdf.fillna(0)
```

**Paso 3: Matriz de pesos espaciales**

```python
from libpysal.weights import DistanceBand

# Calcular centroides de celdas
grid_gdf['centroid'] = grid_gdf.geometry.centroid
coords = [(geom.y, geom.x) for geom in grid_gdf['centroid']]

# Matriz de vecindad (distancia < 0.02° ≈ 2.2 km)
w = DistanceBand.from_array(coords, threshold=0.02, binary=True)
```

**Paso 4: Calcular Getis-Ord Gi***

```python
from esda.getisord import G_Local

# Aplicar Getis-Ord Gi*
gi_star = G_Local(
    grid_gdf['n_accidentes'],
    w,
    star=True,           # Gi* (incluye autocorrelación del punto i)
    permutations=0       # Inferencia paramétrica
)

grid_gdf['gi_score'] = gi_star.Zs      # Z-scores
grid_gdf['gi_pvalue'] = gi_star.p_norm  # p-values
```

**Fórmula de Getis-Ord Gi*:**

$$
G_i^* = \frac{\sum_{j} w_{ij} x_j - \bar{X} \sum_{j} w_{ij}}{S \sqrt{\frac{n \sum_{j} w_{ij}^2 - (\sum_{j} w_{ij})^2}{n - 1}}}
$$

Donde:
- $x_j$ = número de accidentes en celda $j$
- $w_{ij}$ = 1 si dist$(i,j) < \text{threshold}$, 0 en otro caso
- $\bar{X}$ = media global de accidentes por celda
- $S$ = desviación estándar global
- $n$ = número total de celdas

**Interpretación del Z-score:**

| Gi* (Z-score) | p-value | Clasificación |
|---------------|---------|---------------|
| > 2.58 | < 0.01 | **Hot Spot (99% confianza)** |
| > 1.96 | < 0.05 | Hot Spot (95% confianza) |
| -1.96 a 1.96 | > 0.05 | No significativo |
| < -1.96 | < 0.05 | Cold Spot (95% confianza) |
| < -2.58 | < 0.01 | Cold Spot (99% confianza) |

**Paso 5: Clasificación de hot spots**

```python
def clasificar_hotspot(row):
    z = row['gi_score']
    p = row['gi_pvalue']

    if z > 2.58 and p < 0.01:
        return 'HOT_SPOT_99'
    elif z > 1.96 and p < 0.05:
        return 'HOT_SPOT_95'
    elif z < -2.58 and p < 0.01:
        return 'COLD_SPOT_99'
    elif z < -1.96 and p < 0.05:
        return 'COLD_SPOT_95'
    else:
        return 'NO_SIGNIFICATIVO'

grid_gdf['clasificacion'] = grid_gdf.apply(clasificar_hotspot, axis=1)
```

**Resultados:**

| Clasificación | Celdas | Porcentaje |
|---------------|--------|------------|
| Hot Spot (99%) | 13 | 1.7% |
| Hot Spot (95%) | 17 | 2.3% |
| No significativo | 725 | 96.0% |
| Cold Spot (95%) | 0 | 0% |
| Cold Spot (99%) | 0 | 0% |

**Índice de riesgo por hot spot:**

```python
def calcular_riesgo_hotspot(grid_gdf):
    """
    Normaliza Z-scores a escala 0-100
    Solo para hot spots significativos
    """
    # Filtrar solo hot spots
    hotspots = grid_gdf[grid_gdf['gi_score'] > 1.96].copy()

    if len(hotspots) > 0:
        min_z = hotspots['gi_score'].min()
        max_z = hotspots['gi_score'].max()

        hotspots['riesgo_hotspot'] = 50 + 50 * (
            (hotspots['gi_score'] - min_z) / (max_z - min_z)
        )

    grid_gdf = grid_gdf.merge(
        hotspots[['geometry', 'riesgo_hotspot']],
        on='geometry',
        how='left'
    ).fillna(0)

    return grid_gdf

grid_gdf = calcular_riesgo_hotspot(grid_gdf)
```

**Archivo generado:**
- `GRID_HOTSPOTS.csv` (755 celdas con estadísticas)

##### C. Autocorrelación Espacial (Moran's I)

**Objetivo:** Medir si los accidentes están distribuidos aleatoriamente o muestran patrones espaciales

**Fórmula de Moran's I Global:**

$$
I = \frac{n}{\sum_i \sum_j w_{ij}} \times \frac{\sum_i \sum_j w_{ij} (x_i - \bar{x})(x_j - \bar{x})}{\sum_i (x_i - \bar{x})^2}
$$

Donde:
- $n$ = número de celdas
- $w_{ij}$ = peso espacial entre celdas $i$ y $j$
- $x_i$ = número de accidentes en celda $i$
- $\bar{x}$ = media global de accidentes

**Implementación:**

```python
from esda.moran import Moran

# Calcular Moran's I
moran = Moran(
    grid_gdf['n_accidentes'],
    w,
    permutations=999  # 999 permutaciones para p-value
)

print(f"Moran's I: {moran.I:.4f}")
print(f"p-value: {moran.p_sim:.4f}")
print(f"Esperado (aleatorio): {moran.EI:.4f}")
print(f"Varianza: {moran.VI_rand:.6f}")
```

**Resultado obtenido:**

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| **Moran's I** | **0.6837** | Clustering fuerte |
| p-value | < 0.001 | Altamente significativo |
| Esperado (aleatorio) | -0.0013 | Referencia |
| Z-score | 27.34 | Muy alejado del azar |

**Interpretación:**
- **I = 0.6837 >> 0:** Fuerte clustering espacial
- Los accidentes NO están distribuidos aleatoriamente
- Zonas de alta concentración están agrupadas
- Justifica el uso de análisis espacial

**Archivo generado:**
- `ACCIDENTES_CON_CLUSTERING.csv` (32,139 puntos con cluster_dbscan y riesgo_cluster)

#### 2.4.2 Machine Learning Predictivo

##### A. Feature Selection Comprehensivo

**Objetivo:** Seleccionar las mejores características para predecir la gravedad de accidentes

**Exploración inicial:**
- **Columnas disponibles:** 60+
- **Estrategia:** Reducir dimensionalidad manteniendo poder predictivo

**Paso 1: Pre-filtrado**

```python
# Eliminar columnas irrelevantes
columnas_excluir = [
    'id',                # Identificador único
    'latitud', 'longitud',  # Coordenadas (usadas en riesgo espacial)
    'fechahora',         # Timestamp (descompuesto en features)
    'severidad',         # Variable derivada de target
    'gravedad'           # Variable target
]

# Eliminar columnas con >50% nulos
umbral_nulos = 0.5
columnas_nulas = df.columns[df.isnull().mean() > umbral_nulos]

# Columnas finales candidatas
columnas_candidatas = [col for col in df.columns
                       if col not in columnas_excluir
                       and col not in columnas_nulas]

# Resultado: 35 columnas candidatas
```

**Paso 2: Algoritmo 1 - SelectKBest (F-score)**

```python
from sklearn.feature_selection import SelectKBest, f_classif

# Preparar datos
X = df[columnas_candidatas]
y = df['gravedad']

# Aplicar SelectKBest
selector_kbest = SelectKBest(score_func=f_classif, k=20)
selector_kbest.fit(X, y)

# Obtener features seleccionadas
scores = pd.DataFrame({
    'feature': columnas_candidatas,
    'f_score': selector_kbest.scores_
}).sort_values('f_score', ascending=False)

features_kbest = scores.head(20)['feature'].tolist()
```

**Fórmula F-score:**

$$
F = \frac{\text{Varianza entre grupos}}{\text{Varianza dentro de grupos}}
$$

$$
F = \frac{\sum_{k} n_k (\bar{x}_k - \bar{x})^2 / (K - 1)}{\sum_{k} \sum_{i} (x_{ki} - \bar{x}_k)^2 / (N - K)}
$$

**Paso 3: Algoritmo 2 - RFE (Recursive Feature Elimination)**

```python
from sklearn.feature_selection import RFE
from sklearn.ensemble import RandomForestClassifier

# Estimador base
estimator = RandomForestClassifier(
    n_estimators=50,
    max_depth=5,
    random_state=42
)

# Aplicar RFE
selector_rfe = RFE(
    estimator=estimator,
    n_features_to_select=20,
    step=1  # Eliminar 1 feature a la vez
)
selector_rfe.fit(X, y)

# Features seleccionadas
features_rfe = [col for col, selected in zip(columnas_candidatas, selector_rfe.support_)
                if selected]
```

**Algoritmo RFE:**
1. Entrenar modelo con todas las features
2. Calcular importancia de cada feature
3. Eliminar la feature menos importante
4. Repetir hasta alcanzar k features

**Paso 4: Algoritmo 3 - Feature Importance (Random Forest)**

```python
# Entrenar Random Forest completo
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
rf.fit(X, y)

# Obtener importancias
importances = pd.DataFrame({
    'feature': columnas_candidatas,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

features_importance = importances.head(20)['feature'].tolist()
```

**Fórmula Feature Importance (Gini):**

$$
\text{Importance}(f_j) = \frac{1}{N_{\text{trees}}} \sum_{t=1}^{N} \sum_{i \in \text{splits}_j} \frac{n_i}{n_{\text{total}}} \times \Delta \text{Gini}_i
$$

Donde:
- $\Delta \text{Gini}_i$ = reducción de impureza en split $i$
- $n_i$ = número de samples en split $i$

**Paso 5: Votación por Consenso**

```python
from collections import Counter

# Contar apariciones de cada feature
todos_features = features_kbest + features_rfe + features_importance
contador = Counter(todos_features)

# Seleccionar features que aparecen en ≥2 algoritmos
features_finales = [feat for feat, count in contador.items() if count >= 2]

print(f"Features seleccionadas: {len(features_finales)}")
print(features_finales)
```

**Features finales seleccionadas (20 características):**

| Feature | Aparece en | F-score | Importance |
|---------|-----------|---------|------------|
| `hora` | 3/3 | ✓✓✓ | 0.142 |
| `dia_semana` | 3/3 | ✓✓✓ | 0.098 |
| `mes` | 3/3 | ✓✓✓ | 0.087 |
| `franja_horaria` | 3/3 | ✓✓✓ | 0.134 |
| `es_hora_pico` | 3/3 | ✓✓✓ | 0.076 |
| `es_fin_de_semana` | 3/3 | ✓✓✓ | 0.054 |
| `riesgo_cluster` | 3/3 | ✓✓✓ | 0.112 |
| `cluster_dbscan` | 2/3 | ✓✓ | 0.089 |
| `urbana` | 2/3 | ✓✓ | 0.032 |
| `automovil` | 2/3 | ✓✓ | 0.045 |
| `motocicleta` | 2/3 | ✓✓ | 0.037 |
| `bicicleta` | 2/3 | ✓✓ | 0.028 |
| `tipaccid` | 2/3 | ✓✓ | 0.067 |
| `clase` | 2/3 | ✓✓ | 0.059 |
| ... | ... | ... | ... |

##### B. Modelos de Machine Learning

**División de datos:**

```python
from sklearn.model_selection import train_test_split

# Preparar X, y
X = df[features_finales]
y = df['gravedad']

# Split 70% train, 30% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.3,
    random_state=42,
    stratify=y  # Mantener proporción de clases
)
```

**Normalización:**

```python
from sklearn.preprocessing import StandardScaler

# Estandarizar features numéricas
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Guardar scaler para producción
import pickle
with open('modelos/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
```

**Fórmula de estandarización:**

$$
z = \frac{x - \mu}{\sigma}
$$

Donde:
- $\mu$ = media del feature en train set
- $\sigma$ = desviación estándar en train set

**Modelo 1: Decision Tree**

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

# Entrenar
dt = DecisionTreeClassifier(
    max_depth=5,
    min_samples_split=100,
    min_samples_leaf=50,
    random_state=42
)
dt.fit(X_train_scaled, y_train)

# Evaluar
y_pred_dt = dt.predict(X_test_scaled)
acc_dt = accuracy_score(y_test, y_pred_dt)
print(f"Decision Tree Accuracy: {acc_dt:.4f}")
```

**Fórmula Gini Impurity:**

$$
\text{Gini}(t) = 1 - \sum_{i=1}^{C} p_i^2
$$

Donde:
- $C$ = número de clases (2 en este caso)
- $p_i$ = proporción de clase $i$ en nodo $t$

**Information Gain:**

$$
\text{IG}(t, f) = \text{Gini}(t) - \sum_{c \in \text{children}} \frac{n_c}{n_t} \times \text{Gini}(c)
$$

**Resultados Decision Tree:**

| Métrica | Clase 0 (Leve) | Clase 1 (Grave) | Promedio |
|---------|----------------|-----------------|----------|
| Precision | 0.86 | 0.78 | 0.84 |
| Recall | 0.91 | 0.65 | 0.85 |
| F1-Score | 0.88 | 0.71 | 0.84 |
| **Accuracy** | - | - | **0.82** |

**Modelo 2: Random Forest**

```python
from sklearn.ensemble import RandomForestClassifier

# Entrenar
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=50,
    min_samples_leaf=20,
    max_features='sqrt',
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train_scaled, y_train)

# Evaluar
y_pred_rf = rf.predict(X_test_scaled)
acc_rf = accuracy_score(y_test, y_pred_rf)
print(f"Random Forest Accuracy: {acc_rf:.4f}")

# Guardar modelo
with open('modelos/modelo_riesgo_rf.pkl', 'wb') as f:
    pickle.dump(rf, f)
```

**Fórmula Random Forest (Ensemble):**

$$
P_{\text{ensemble}}(\text{grave} | X) = \frac{1}{N} \sum_{i=1}^{N} P_i(\text{grave} | X)
$$

Donde:
- $N$ = número de árboles (100)
- $P_i$ = predicción del árbol $i$

**Resultados Random Forest:**

| Métrica | Clase 0 (Leve) | Clase 1 (Grave) | Promedio |
|---------|----------------|-----------------|----------|
| Precision | 0.89 | 0.85 | 0.88 |
| Recall | 0.94 | 0.72 | 0.89 |
| F1-Score | 0.91 | 0.78 | 0.88 |
| **Accuracy** | - | - | **0.87** |

**Modelo 3: Logistic Regression**

```python
from sklearn.linear_model import LogisticRegression

# Entrenar
lr = LogisticRegression(
    max_iter=1000,
    random_state=42,
    solver='lbfgs'
)
lr.fit(X_train_scaled, y_train)

# Evaluar
y_pred_lr = lr.predict(X_test_scaled)
acc_lr = accuracy_score(y_test, y_pred_lr)
print(f"Logistic Regression Accuracy: {acc_lr:.4f}")
```

**Fórmula Logistic Regression:**

$$
P(y=1 | X) = \frac{1}{1 + e^{-z}}
$$

Donde:

$$
z = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \ldots + \beta_n x_n
$$

**Resultados Logistic Regression:**

| Métrica | Clase 0 (Leve) | Clase 1 (Grave) | Promedio |
|---------|----------------|-----------------|----------|
| Precision | 0.84 | 0.74 | 0.81 |
| Recall | 0.88 | 0.63 | 0.82 |
| F1-Score | 0.86 | 0.68 | 0.81 |
| **Accuracy** | - | - | **0.78** |

**Modelo 4: Stacking Ensemble**

```python
from sklearn.ensemble import StackingClassifier

# Definir base learners
base_learners = [
    ('dt', dt),
    ('rf', rf),
    ('lr', lr)
]

# Meta-learner
meta_learner = LogisticRegression(random_state=42)

# Stacking
stacking = StackingClassifier(
    estimators=base_learners,
    final_estimator=meta_learner,
    cv=5,  # 5-fold cross-validation
    stack_method='predict_proba'
)
stacking.fit(X_train_scaled, y_train)

# Evaluar
y_pred_stack = stacking.predict(X_test_scaled)
acc_stack = accuracy_score(y_test, y_pred_stack)
print(f"Stacking Accuracy: {acc_stack:.4f}")
```

**Arquitectura del Stacking:**

```
Level 0 (Base Learners):
├── Decision Tree → P₁(grave|X)
├── Random Forest → P₂(grave|X)
└── Logistic Regression → P₃(grave|X)
         ↓
    [P₁, P₂, P₃] (features para meta-learner)
         ↓
Level 1 (Meta-Learner):
└── Logistic Regression → P_final(grave|X)
```

**Fórmula Stacking:**

$$
P_{\text{stack}}(\text{grave} | X) = \sigma(w_1 P_1 + w_2 P_2 + w_3 P_3 + b)
$$

Donde:
- $\sigma()$ = función logística
- $w_1, w_2, w_3, b$ = parámetros aprendidos por meta-learner

**Resultados Stacking Ensemble:**

| Métrica | Clase 0 (Leve) | Clase 1 (Grave) | Promedio |
|---------|----------------|-----------------|----------|
| Precision | 0.90 | 0.86 | 0.89 |
| Recall | 0.95 | 0.74 | 0.90 |
| F1-Score | 0.92 | 0.80 | 0.89 |
| **Accuracy** | - | - | **0.88** |

**Comparación de modelos:**

| Modelo | Accuracy | Precision | Recall | F1-Score | AUC-ROC |
|--------|----------|-----------|--------|----------|---------|
| Decision Tree | 0.82 | 0.78 | 0.65 | 0.71 | 0.78 |
| Random Forest | **0.87** | 0.85 | 0.72 | 0.78 | 0.84 |
| Logistic Regression | 0.78 | 0.74 | 0.63 | 0.68 | 0.75 |
| **Stacking Ensemble** | **0.88** | **0.86** | **0.74** | **0.80** | **0.86** |

**Ganador:** Stacking Ensemble (mejor performance general)

##### C. Scoring de Riesgo ML

**Probabilidad de accidente grave:**

```python
# Usar el mejor modelo (Stacking)
y_proba = stacking.predict_proba(X_test_scaled)

# Probabilidad de clase grave (columna 1)
prob_grave = y_proba[:, 1]

# Escalar a 0-100
riesgo_ml = prob_grave * 100
```

**Fórmula:**

$$
\text{riesgo\_ml} = P(\text{grave} | \text{features}) \times 100
$$

**Interpretación:**
- `riesgo_ml = 10`: 10% probabilidad de accidente grave
- `riesgo_ml = 50`: 50% probabilidad (alta incertidumbre)
- `riesgo_ml = 90`: 90% probabilidad (muy alto riesgo)

**Distribución de riesgo ML:**

| Percentil | Riesgo ML |
|-----------|-----------|
| 25% | 8.3 |
| 50% (mediana) | 12.7 |
| 75% | 21.4 |
| 90% | 38.6 |
| 95% | 52.1 |
| 99% | 78.4 |

**Archivo generado:**
- `SCORING_RIESGO_COMPUESTO.csv` (72,131 puntos con riesgo_ml)

#### 2.4.3 Índice de Riesgo Compuesto Final

**Objetivo:** Combinar las 3 capas de riesgo en un índice único

**Fórmula de integración:**

$$
\text{riesgo\_compuesto} = 0.6 \times \text{riesgo\_histórico} + 0.1 \times \text{riesgo\_cluster} + 0.3 \times \text{riesgo\_ml}
$$

**Justificación de ponderaciones:**

| Capa | Peso | Justificación |
|------|------|---------------|
| **Riesgo Histórico** | 60% | Datos reales de accidentes (más confiable) |
| **Riesgo ML** | 30% | Predicción de gravedad con contexto (complemento importante) |
| **Riesgo Cluster** | 10% | Patrones espaciales (información adicional) |

**Implementación:**

```python
def calcular_riesgo_compuesto(df):
    """
    Combina las 3 capas de riesgo

    Entrada:
    - riesgo_historico: [0, 100] - accidentes por tramo
    - riesgo_cluster: [0, 100] - tamaño de cluster
    - riesgo_ml: [0, 100] - probabilidad de gravedad

    Salida:
    - riesgo_compuesto: [0, 100] - índice final
    """
    df['riesgo_compuesto'] = (
        0.6 * df['riesgo_historico'] +
        0.1 * df['riesgo_cluster'] +
        0.3 * df['riesgo_ml']
    )

    # Asegurar rango [0, 100]
    df['riesgo_compuesto'] = df['riesgo_compuesto'].clip(0, 100)

    return df

df_scoring = calcular_riesgo_compuesto(df_scoring)
```

**Distribución del índice compuesto:**

| Percentil | Riesgo Compuesto | Interpretación |
|-----------|------------------|----------------|
| 25% | 18.4 | Riesgo bajo |
| 50% (mediana) | 32.7 | Riesgo medio-bajo |
| 75% | 48.3 | Riesgo medio-alto |
| 90% | 65.2 | Riesgo alto |
| 95% | 74.8 | Riesgo muy alto |
| 99% | 87.3 | Riesgo crítico |

**Clasificación de niveles de riesgo:**

```python
def clasificar_nivel_riesgo(riesgo):
    if riesgo < 20:
        return 'MUY_BAJO'
    elif riesgo < 40:
        return 'BAJO'
    elif riesgo < 60:
        return 'MEDIO'
    elif riesgo < 80:
        return 'ALTO'
    else:
        return 'MUY_ALTO'

df_scoring['nivel_riesgo'] = df_scoring['riesgo_compuesto'].apply(clasificar_nivel_riesgo)
```

**Distribución por niveles:**

| Nivel | Registros | Porcentaje |
|-------|-----------|------------|
| MUY_BAJO | 15,234 | 21.1% |
| BAJO | 24,567 | 34.1% |
| MEDIO | 18,932 | 26.3% |
| ALTO | 10,124 | 14.0% |
| MUY_ALTO | 3,274 | 4.5% |

**Archivo final generado:**
- `SCORING_RIESGO_COMPUESTO.csv` con columnas:
  - `latitud`, `longitud`
  - `riesgo_historico`
  - `riesgo_cluster`
  - `riesgo_ml`
  - `riesgo_compuesto` ⭐
  - `nivel_riesgo`

---

### 2.5 Interpretación y Evaluación (Interpretation/Evaluation)

#### 2.5.1 Sistema de Ruteo Seguro

**Objetivo:** Calcular rutas alternativas que optimicen la seguridad vial

**Caso de uso:** Ruta del Zócalo (Centro Histórico) a Polanco (Museo Soumaya)

##### A. Asignación de Riesgo a Calles

**Función:** `asignar_riesgo_a_edges_completo()`

**Paso 1: Matching de riesgo histórico (exacto por IDs)**

```python
# Crear diccionario de lookup
stats_dict = {}
for idx, row in stats_tramos.iterrows():
    key = (str(row['edge_u']), str(row['edge_v']), row['edge_key'])
    stats_dict[key] = row['riesgo_historico']

# Asignar a cada arista del grafo
for u, v, key, data in G.edges(keys=True, data=True):
    lookup_key = (str(u), str(v), key)
    riesgo_hist = stats_dict.get(lookup_key, 25)  # Default: medio
    data['riesgo_historico'] = riesgo_hist
```

**Paso 2: Matching espacial para clustering + ML (KDTree)**

```python
from scipy.spatial import cKDTree

# Construir KDTree de puntos con scoring
coords_scoring = df_scoring[['latitud', 'longitud']].values
tree = cKDTree(coords_scoring)

# Para cada arista, buscar punto de scoring más cercano
for u, v, key, data in G.edges(keys=True, data=True):
    # Obtener centroide del edge
    nodo_u = G.nodes[u]
    nodo_v = G.nodes[v]
    lat_centro = (nodo_u['y'] + nodo_v['y']) / 2
    lon_centro = (nodo_u['x'] + nodo_v['x']) / 2

    # Buscar vecino más cercano
    dist, idx = tree.query([lat_centro, lon_centro], k=1)

    # Si está dentro de 500m, asignar riesgo
    if dist < 0.005:  # ~500 metros en grados
        data['riesgo_cluster'] = df_scoring.iloc[idx]['riesgo_cluster']
        data['riesgo_ml'] = df_scoring.iloc[idx]['riesgo_ml']
    else:
        data['riesgo_cluster'] = 0   # No cluster detectado
        data['riesgo_ml'] = 15       # Riesgo bajo-medio por defecto
```

**Paso 3: Calcular riesgo compuesto**

```python
for u, v, key, data in G.edges(keys=True, data=True):
    riesgo_comp = (
        0.6 * data['riesgo_historico'] +
        0.1 * data['riesgo_cluster'] +
        0.3 * data['riesgo_ml']
    )
    data['riesgo_compuesto'] = riesgo_comp
```

##### B. Funciones de Peso para Dijkstra

**Peso 1: Solo Distancia (Ruta Más Corta)**

```python
def peso_distancia(u, v, key, data):
    """
    Minimiza distancia total
    Ignora completamente el riesgo
    """
    return data['length']  # metros
```

$$
w_{\text{distancia}} = \text{longitud}
$$

**Peso 2: Balanceado (Trade-off)**

```python
def peso_balanceado(u, v, key, data):
    """
    Equilibrio entre distancia y seguridad
    Penaliza calles peligrosas moderadamente
    """
    longitud = data['length']
    riesgo = data.get('riesgo_compuesto', 25)

    return longitud * (1 + riesgo / 100)
```

$$
w_{\text{balanceado}} = \text{longitud} \times \left(1 + \frac{\text{riesgo}}{100}\right)
$$

**Ejemplo numérico:**
- Calle de 1000m con riesgo 0: peso = 1000 × 1.0 = 1000
- Calle de 1000m con riesgo 50: peso = 1000 × 1.5 = 1500
- Calle de 1000m con riesgo 100: peso = 1000 × 2.0 = 2000

**Peso 3: Seguro (Prioriza Seguridad)**

```python
def peso_seguro(u, v, key, data):
    """
    Prioriza seguridad sobre distancia
    Penaliza fuertemente calles peligrosas
    """
    longitud = data['length']
    riesgo = data.get('riesgo_compuesto', 25)

    return longitud * (1 + 2 * riesgo / 100)
```

$$
w_{\text{seguro}} = \text{longitud} \times \left(1 + \frac{2 \times \text{riesgo}}{100}\right)
$$

**Ejemplo numérico:**
- Calle de 1000m con riesgo 0: peso = 1000 × 1.0 = 1000
- Calle de 1000m con riesgo 50: peso = 1000 × 2.0 = 2000
- Calle de 1000m con riesgo 100: peso = 1000 × 3.0 = 3000

**Interpretación del factor 2:**
- Amplifica la penalización por riesgo
- Hace que el algoritmo evite calles peligrosas activamente
- Balance: acepta +20-30% distancia para reducir riesgo significativamente

##### C. Algoritmo de Dijkstra

**Pseudocódigo:**

```
Dijkstra(grafo G, origen s, destino t, función_peso w):
    1. Inicializar:
       dist[s] = 0
       dist[v] = ∞ para todo v ≠ s
       prev[v] = null para todo v
       Q = todos los nodos del grafo

    2. Mientras Q no esté vacío:
       u = nodo en Q con dist[u] mínima
       Remover u de Q

       Si u == t:
           break  # Destino alcanzado

       Para cada vecino v de u:
           alt = dist[u] + w(u, v)
           Si alt < dist[v]:
               dist[v] = alt
               prev[v] = u

    3. Reconstruir camino:
       camino = []
       u = t
       Mientras prev[u] existe:
           camino.prepend(u)
           u = prev[u]
       camino.prepend(s)

    4. Retornar camino, dist[t]
```

**Implementación con NetworkX:**

```python
import networkx as nx

# Coordenadas de origen y destino
origen_lat, origen_lon = 19.4326, -99.1332  # Zócalo
destino_lat, destino_lon = 19.4406, -99.2006  # Polanco

# Encontrar nodos más cercanos
nodo_origen = ox.distance.nearest_nodes(G, origen_lon, origen_lat)
nodo_destino = ox.distance.nearest_nodes(G, destino_lon, destino_lat)

# Calcular 3 rutas con diferentes pesos
ruta_corta = nx.shortest_path(
    G,
    source=nodo_origen,
    target=nodo_destino,
    weight='length',
    method='dijkstra'
)

ruta_balanceada = nx.shortest_path(
    G,
    source=nodo_origen,
    target=nodo_destino,
    weight=lambda u, v, k, d: d['length'] * (1 + d['riesgo_compuesto']/100),
    method='dijkstra'
)

ruta_segura = nx.shortest_path(
    G,
    source=nodo_origen,
    target=nodo_destino,
    weight=lambda u, v, k, d: d['length'] * (1 + 2*d['riesgo_compuesto']/100),
    method='dijkstra'
)
```

**Complejidad temporal:**

$$
O((V + E) \log V)
$$

Donde:
- $V$ = número de nodos (99,728)
- $E$ = número de aristas (234,532)

##### D. Métricas de Rutas

**Para cada ruta, calcular:**

```python
def calcular_metricas_ruta(G, ruta):
    """
    Calcula métricas completas de una ruta
    """
    # Distancia total
    distancia_total = sum(
        G[u][v][0]['length']
        for u, v in zip(ruta[:-1], ruta[1:])
    )

    # Riesgos
    riesgos = [
        G[u][v][0].get('riesgo_compuesto', 25)
        for u, v in zip(ruta[:-1], ruta[1:])
    ]

    riesgo_promedio = np.mean(riesgos)
    riesgo_maximo = np.max(riesgos)
    riesgo_total = np.sum(riesgos)
    desviacion_riesgo = np.std(riesgos)

    # Score de seguridad
    score_seguridad = 100 - riesgo_promedio

    # Número de segmentos
    num_segmentos = len(ruta) - 1

    return {
        'distancia_km': distancia_total / 1000,
        'riesgo_promedio': riesgo_promedio,
        'riesgo_maximo': riesgo_maximo,
        'riesgo_total': riesgo_total,
        'desviacion_riesgo': desviacion_riesgo,
        'score_seguridad': score_seguridad,
        'num_segmentos': num_segmentos
    }
```

**Fórmulas:**

$$
\text{distancia\_total} = \sum_{i=1}^{n-1} \text{longitud}(\text{nodo}_i, \text{nodo}_{i+1})
$$

$$
\text{riesgo\_promedio} = \frac{1}{n-1} \sum_{i=1}^{n-1} \text{riesgo}(\text{nodo}_i, \text{nodo}_{i+1})
$$

$$
\text{score\_seguridad} = 100 - \text{riesgo\_promedio}
$$

##### E. Resultados del Sistema de Ruteo

**Caso: Zócalo → Polanco**

| Ruta | Dist (km) | Riesgo Prom | Riesgo Máx | Segmentos | Score Seguridad |
|------|-----------|-------------|------------|-----------|-----------------|
| 🔵 **Más Corta** | **8.74** | 42.3 | 58.1 | 67 | 57.7 |
| 🟠 **Balanceada** | 9.12 | 35.8 | 52.4 | 72 | **64.2** |
| 🟢 **Más Segura** | 10.23 | **28.5** | **45.7** | 81 | **71.5** |

**Análisis de Trade-offs:**

```python
# Ruta Más Segura vs Ruta Más Corta
diff_distancia = 10.23 - 8.74  # +1.49 km
diff_distancia_pct = (diff_distancia / 8.74) * 100  # +17.0%

diff_riesgo = 42.3 - 28.5  # -13.8 puntos
diff_riesgo_pct = (diff_riesgo / 42.3) * 100  # -32.6%

# Tiempo adicional estimado
velocidad_promedio = 25  # km/h en CDMX
tiempo_adicional = (diff_distancia / velocidad_promedio) * 60  # minutos
```

**Resultado:**
- **Distancia adicional:** +1.49 km (+17.0%)
- **Reducción de riesgo:** -13.8 puntos (-32.6%)
- **Tiempo adicional:** ~4 minutos
- **Valor:** Mucho más seguro con costo mínimo en tiempo

**Recomendación del sistema:**

```python
def recomendar_ruta(metricas):
    """
    Lógica de recomendación basada en trade-offs
    """
    diff_riesgo_pct = (
        (metricas['corta']['riesgo_prom'] - metricas['segura']['riesgo_prom']) /
        metricas['corta']['riesgo_prom'] * 100
    )

    diff_dist_pct = (
        (metricas['segura']['dist'] - metricas['corta']['dist']) /
        metricas['corta']['dist'] * 100
    )

    if diff_riesgo_pct > 20 and diff_dist_pct < 25:
        return "RUTA_MAS_SEGURA"  # Vale la pena el trade-off
    elif diff_riesgo_pct > 10:
        return "RUTA_BALANCEADA"  # Equilibrio razonable
    else:
        return "RUTA_MAS_CORTA"   # Diferencia marginal
```

**Recomendación para Zócalo → Polanco:**
```
🎯 RUTA MÁS SEGURA

Justificación:
✓ Reduce el riesgo en 32.6%
✓ Solo 1.5 km más larga (17%)
✓ ~4 minutos adicionales
💰 Valor: Mucho más seguro con costo mínimo en tiempo
```

#### 2.5.2 Visualizaciones Interactivas

**Mapa 1: Clusters DBSCAN + Hot Spots**

```python
import folium

# Crear mapa base
mapa = folium.Map(
    location=[19.4, -99.15],
    zoom_start=11,
    tiles='OpenStreetMap'
)

# Añadir clusters DBSCAN
for cluster_id in df['cluster_dbscan'].unique():
    if cluster_id == -1:
        continue  # Saltar ruido

    cluster_points = df[df['cluster_dbscan'] == cluster_id]

    # Color por tamaño de cluster
    size = len(cluster_points)
    color = 'red' if size > 100 else 'orange' if size > 50 else 'yellow'

    # Añadir marcadores
    for idx, row in cluster_points.iterrows():
        folium.CircleMarker(
            location=[row['latitud'], row['longitud']],
            radius=3,
            color=color,
            fill=True,
            fillOpacity=0.6,
            popup=f"Cluster {cluster_id}<br>Tamaño: {size}"
        ).add_to(mapa)

# Añadir hot spots
hotspots = grid_gdf[grid_gdf['clasificacion'].isin(['HOT_SPOT_99', 'HOT_SPOT_95'])]

for idx, row in hotspots.iterrows():
    folium.Polygon(
        locations=[[coord[1], coord[0]] for coord in row['geometry'].exterior.coords],
        color='red',
        fill=True,
        fillOpacity=0.5,
        popup=f"Hot Spot<br>Z-score: {row['gi_score']:.2f}"
    ).add_to(mapa)

# Guardar
mapa.save('mapas/mapa_clusters_dbscan.html')
```

**Mapa 2: Rutas Comparativas Zócalo → Polanco**

```python
# Crear mapa base
mapa_rutas = folium.Map(
    location=[19.43, -99.17],
    zoom_start=12,
    tiles='OpenStreetMap'
)

# Colores y nombres de rutas
rutas_config = [
    {'ruta': ruta_corta, 'color': 'blue', 'nombre': 'Más Corta'},
    {'ruta': ruta_balanceada, 'color': 'orange', 'nombre': 'Balanceada'},
    {'ruta': ruta_segura, 'color': 'green', 'nombre': 'Más Segura'}
]

# Dibujar cada ruta
for config in rutas_config:
    coords = [
        [G.nodes[n]['y'], G.nodes[n]['x']]
        for n in config['ruta']
    ]

    folium.PolyLine(
        locations=coords,
        color=config['color'],
        weight=5,
        opacity=0.7,
        popup=config['nombre']
    ).add_to(mapa_rutas)

# Marcadores de origen y destino
folium.Marker(
    location=[origen_lat, origen_lon],
    icon=folium.Icon(color='green', icon='play'),
    popup='Origen: Zócalo'
).add_to(mapa_rutas)

folium.Marker(
    location=[destino_lat, destino_lon],
    icon=folium.Icon(color='red', icon='stop'),
    popup='Destino: Polanco'
).add_to(mapa_rutas)

# Leyenda embebida
leyenda_html = '''
<div style="position: fixed;
            top: 10px; right: 10px; width: 250px; height: auto;
            background-color: white; border:2px solid grey; z-index:9999;
            font-size:14px; padding: 10px">
<p><b>Rutas Zócalo → Polanco</b></p>
<p><span style="color:blue;">━━━</span> Más Corta (8.74 km)</p>
<p><span style="color:orange;">━━━</span> Balanceada (9.12 km)</p>
<p><span style="color:green;">━━━</span> Más Segura (10.23 km) ⭐</p>
</div>
'''
mapa_rutas.get_root().html.add_child(folium.Element(leyenda_html))

# Guardar
mapa_rutas.save('mapas/mapa_rutas_zocalo_polanco.html')
```

**Visualización 3: Perfil de Riesgo**

```python
import matplotlib.pyplot as plt

# Calcular riesgo acumulado a lo largo de cada ruta
def calcular_perfil_riesgo(G, ruta):
    distancias_acum = [0]
    riesgos = []

    for u, v in zip(ruta[:-1], ruta[1:]):
        dist = G[u][v][0]['length'] / 1000  # km
        riesgo = G[u][v][0].get('riesgo_compuesto', 25)

        distancias_acum.append(distancias_acum[-1] + dist)
        riesgos.append(riesgo)

    return distancias_acum[1:], riesgos

# Calcular perfiles
dist_corta, riesgo_corta = calcular_perfil_riesgo(G, ruta_corta)
dist_bal, riesgo_bal = calcular_perfil_riesgo(G, ruta_balanceada)
dist_seg, riesgo_seg = calcular_perfil_riesgo(G, ruta_segura)

# Graficar
plt.figure(figsize=(12, 6))
plt.plot(dist_corta, riesgo_corta, 'b-', label='Más Corta', linewidth=2)
plt.plot(dist_bal, riesgo_bal, 'orange', label='Balanceada', linewidth=2)
plt.plot(dist_seg, riesgo_seg, 'g-', label='Más Segura', linewidth=2)

# Zonas de riesgo
plt.axhline(y=60, color='r', linestyle='--', alpha=0.3, label='Alto Riesgo')
plt.axhline(y=30, color='y', linestyle='--', alpha=0.3, label='Riesgo Moderado')

plt.xlabel('Distancia Acumulada (km)', fontsize=12)
plt.ylabel('Riesgo Compuesto', fontsize=12)
plt.title('Perfil de Riesgo a lo Largo de las Rutas', fontsize=14)
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('mapas/perfil_riesgo_rutas.png', dpi=300)
```

**Visualización 4: Radar Chart Multidimensional**

```python
import numpy as np
import matplotlib.pyplot as plt

# Métricas normalizadas
categorias = ['Seguridad', 'Eficiencia', 'Estabilidad']

# Normalizar métricas a escala 0-100
metricas_norm = {
    'corta': [57.7, 100, 41.9],      # Seguridad baja, eficiencia máxima
    'balanceada': [64.2, 95.7, 47.6],
    'segura': [71.5, 85.4, 54.3]     # Seguridad alta, eficiencia menor
}

# Crear radar chart
angulos = np.linspace(0, 2 * np.pi, len(categorias), endpoint=False).tolist()
angulos += angulos[:1]

fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))

for nombre, valores in metricas_norm.items():
    valores += valores[:1]
    ax.plot(angulos, valores, 'o-', linewidth=2, label=nombre.capitalize())
    ax.fill(angulos, valores, alpha=0.15)

ax.set_xticks(angulos[:-1])
ax.set_xticklabels(categorias)
ax.set_ylim(0, 100)
ax.set_title('Comparación Multidimensional de Rutas', size=14, pad=20)
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
ax.grid(True)

plt.tight_layout()
plt.savefig('mapas/radar_chart_rutas.png', dpi=300)
```

#### 2.5.3 Validación y Métricas del Sistema

**Validación de Modelos ML:**

```python
from sklearn.model_selection import cross_val_score
from sklearn.metrics import roc_auc_score, roc_curve

# Cross-validation (5-fold)
cv_scores_rf = cross_val_score(
    rf, X_train_scaled, y_train,
    cv=5,
    scoring='accuracy'
)

print(f"CV Accuracy: {cv_scores_rf.mean():.4f} (+/- {cv_scores_rf.std():.4f})")

# Curva ROC
y_proba_rf = rf.predict_proba(X_test_scaled)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, y_proba_rf)
auc = roc_auc_score(y_test, y_proba_rf)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'Random Forest (AUC = {auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random (AUC = 0.5)')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Curva ROC - Predicción de Gravedad')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('mapas/roc_curve.png', dpi=300)
```

**Resultados de validación:**
- **Cross-validation Accuracy:** 0.8654 (+/- 0.0123)
- **AUC-ROC:** 0.8432
- **Brier Score:** 0.1187 (calibración de probabilidades)

**Validación del Sistema de Ruteo:**

```python
# Comparar con rutas reales de Google Maps
rutas_google = {
    'zocalo_polanco': {
        'distancia_km': 8.9,
        'tiempo_min': 28,
        'via': 'Paseo de la Reforma'
    }
}

# Nuestra ruta balanceada
nuestra_balanceada = {
    'distancia_km': 9.12,
    'riesgo_promedio': 35.8
}

# Comparación
print(f"Google Maps: {rutas_google['zocalo_polanco']['distancia_km']} km")
print(f"Nuestra balanceada: {nuestra_balanceada['distancia_km']} km")
print(f"Diferencia: {abs(9.12 - 8.9):.2f} km (2.5%)")
print(f"Ventaja: Nuestra ruta tiene riesgo cuantificado ({35.8}/100)")
```

---

## 3. Arquitectura del Sistema

### 3.1 Estructura de Archivos

```
Proyecto Final Minería/
│
├── ProyectoMineria/
│   │
│   ├── 📓 NOTEBOOKS PRINCIPALES
│   │   ├── proceso.ipynb                          # 00 - Procesamiento de datos base
│   │   ├── 01_analisis_espacial_clustering.ipynb  # 01 - DBSCAN + Hot Spots
│   │   ├── 02_modelado_ml_causas.ipynb            # 02 - ML + Feature Selection
│   │   ├── 03_sistema_ruteo_zocalo_polanco.ipynb  # 03 - DEMO: Ruteo ⭐
│   │   └── funcionalidades_para_app.ipynb         # Legacy (177 celdas)
│   │
│   ├── 📂 DATOS
│   │   ├── Datos raw/                    # CSV originales C5 CDMX
│   │   │   ├── 2019/ *.csv
│   │   │   ├── 2020/ *.csv
│   │   │   ├── 2021/ *.csv
│   │   │   ├── 2022/ *.csv
│   │   │   └── 2023/ *.csv
│   │   │
│   │   ├── Datos limpios/                # Limpieza básica por año
│   │   │   ├── 2019/ ACCIDENTES_LIMPIO_2019.csv
│   │   │   ├── 2020/ ACCIDENTES_LIMPIO_2020.csv
│   │   │   ├── 2021/ ACCIDENTES_LIMPIO_2021.csv
│   │   │   ├── 2022/ ACCIDENTES_LIMPIO_2022.csv
│   │   │   └── 2023/ ACCIDENTES_LIMPIO_2023.csv
│   │   │
│   │   ├── Datos combinados/             # Consolidado nacional
│   │   │   ├── ACCIDENTES_COMBINADO_2019_2023.csv
│   │   │   └── ACCIDENTES_COMBINADO_2022_2023.csv
│   │   │
│   │   └── Datos combinados CDMX/        # ⭐ CDMX + Features
│   │       ├── ACCIDENTES_COMBINADO_CDMX_2019_2023.csv
│   │       ├── ACCIDENTES_CON_TRAMOS_2019_2023.csv
│   │       ├── STATS_POR_TRAMO_2019_2023.csv
│   │       ├── ACCIDENTES_CON_CLUSTERING.csv
│   │       ├── GRID_HOTSPOTS.csv
│   │       └── SCORING_RIESGO_COMPUESTO.csv  ⭐
│   │
│   ├── 📁 OUTPUTS
│   │   ├── mapas/                        # Visualizaciones HTML
│   │   │   ├── mapa_clusters_dbscan.html
│   │   │   └── mapa_rutas_zocalo_polanco.html ⭐
│   │   │
│   │   ├── modelos/                      # Modelos ML
│   │   │   ├── modelo_riesgo_rf.pkl
│   │   │   ├── scaler.pkl
│   │   │   └── feature_names.pkl
│   │   │
│   │   └── Red vial/
│   │       └── red_vial_cdmx.graphml     # Grafo OSM
│   │
│   ├── 📚 DOCUMENTACIÓN
│   │   └── docs/
│   │       ├── README_DATOS.md
│   │       ├── README_NOTEBOOKS.md
│   │       ├── README_FORMULAS.ipynb
│   │       └── ARQUITECTURA_WEB.md
│   │
│   ├── 🔧 UTILIDADES
│   │   └── scripts_auxiliares/
│   │       ├── README.md
│   │       └── funcion_asignar_tramos_FINAL.py
│   │
│   ├── .gitignore
│   └── README.md
│
├── .gitattributes  # Git LFS config
└── README.md       # ⭐ ESTE ARCHIVO (README GLOBAL)
```

### 3.2 Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRADA DE DATOS                         │
├─────────────────────────────────────────────────────────────┤
│ Datos raw C5 CDMX (2019-2023) + Red Vial OSM              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              PROCESAMIENTO (proceso.ipynb)                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Limpieza de datos                                        │
│ 2. Consolidación temporal                                   │
│ 3. Filtro geográfico (CDMX)                                │
│ 4. Feature Engineering temporal + severidad                │
│ 5. Matching espacial con red vial OSM                      │
│ 6. Agregación de estadísticas por tramo                    │
├─────────────────────────────────────────────────────────────┤
│ SALIDAS:                                                    │
│ - ACCIDENTES_COMBINADO_CDMX_2019_2023.csv                  │
│ - ACCIDENTES_CON_TRAMOS_2019_2023.csv                      │
│ - STATS_POR_TRAMO_2019_2023.csv (riesgo histórico)        │
│ - red_vial_cdmx.graphml                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────────────┐  ┌──────────────────────┐
│  ANÁLISIS ESPACIAL   │  │  MACHINE LEARNING    │
│  (01_clustering)     │  │  (02_ml_causas)      │
├──────────────────────┤  ├──────────────────────┤
│ 1. DBSCAN            │  │ 1. Feature Selection │
│ 2. Getis-Ord Gi*     │  │    - SelectKBest     │
│ 3. Moran's I         │  │    - RFE             │
│ 4. Riesgo cluster    │  │    - Importance      │
├──────────────────────┤  │ 2. Modelos ML        │
│ SALIDAS:             │  │    - Decision Tree   │
│ - ACCIDENTES_CON_    │  │    - Random Forest   │
│   CLUSTERING.csv     │  │    - Log. Regression │
│   (riesgo cluster)   │  │    - Stacking        │
│ - GRID_HOTSPOTS.csv  │  │ 3. Riesgo ML         │
│ - mapa_clusters.html │  ├──────────────────────┤
└──────────┬───────────┘  │ SALIDAS:             │
           │              │ - SCORING_RIESGO_    │
           │              │   COMPUESTO.csv      │
           │              │   (riesgo ML +       │
           │              │    compuesto)        │
           │              │ - modelos/*.pkl      │
           └──────────────┴──────────┬───────────┘
                                     ↓
                  ┌──────────────────────────────────┐
                  │  SISTEMA DE RUTEO                │
                  │  (03_sistema_ruteo)              │
                  ├──────────────────────────────────┤
                  │ 1. Integración 3 capas:          │
                  │    - 60% Riesgo histórico        │
                  │    - 10% Riesgo clustering       │
                  │    - 30% Riesgo ML               │
                  │ 2. Asignación a edges del grafo  │
                  │ 3. Dijkstra con 3 funciones:     │
                  │    - Peso distancia              │
                  │    - Peso balanceado             │
                  │    - Peso seguro                 │
                  │ 4. Comparación de rutas          │
                  │ 5. Recomendación inteligente     │
                  ├──────────────────────────────────┤
                  │ SALIDAS:                         │
                  │ - mapa_rutas_zocalo_polanco.html │
                  │ - Métricas comparativas          │
                  │ - Visualizaciones                │
                  └──────────────────────────────────┘
```

### 3.3 Dependencias Tecnológicas

**Core Libraries:**
- `pandas >= 1.5.0` - Manipulación de datos
- `numpy >= 1.23.0` - Operaciones numéricas

**Geoespacial:**
- `geopandas >= 0.12.0` - Datos geoespaciales
- `shapely >= 2.0.0` - Geometrías
- `osmnx >= 1.3.0` - Red vial OpenStreetMap
- `networkx >= 2.8.0` - Grafos y ruteo

**Machine Learning:**
- `scikit-learn >= 1.2.0` - Modelos y evaluación

**Análisis Espacial Estadístico:**
- `libpysal >= 4.7.0` - Pesos espaciales
- `esda >= 2.4.0` - Autocorrelación, hot spots

**Visualización:**
- `matplotlib >= 3.6.0` - Gráficos estáticos
- `seaborn >= 0.12.0` - Gráficos estadísticos
- `folium >= 0.14.0` - Mapas interactivos HTML

**Utilidades:**
- `scipy >= 1.10.0` - KDTree, estadística

---

## 4. Fórmulas y Metodologías

### 4.1 Resumen de Fórmulas Clave

#### A. Severidad de Accidente

$$
\text{severidad} = 10 \times \text{muertos} + 3 \times \text{heridos}
$$

#### B. DBSCAN

**Vecindad:**
$$
N_{\varepsilon}(p) = \{q \in D : \text{dist}(p, q) \leq \varepsilon\}
$$

**Core point:** $|N_{\varepsilon}(p)| \geq \text{min\_samples}$

#### C. Getis-Ord Gi*

$$
G_i^* = \frac{\sum_j w_{ij} x_j - \bar{X} \sum_j w_{ij}}{S \sqrt{\frac{n \sum_j w_{ij}^2 - (\sum_j w_{ij})^2}{n-1}}}
$$

#### D. Moran's I

$$
I = \frac{n}{\sum_i \sum_j w_{ij}} \times \frac{\sum_i \sum_j w_{ij} (x_i - \bar{x})(x_j - \bar{x})}{\sum_i (x_i - \bar{x})^2}
$$

#### E. Riesgo por Clustering

$$
\text{riesgo\_cluster} = 50 + 50 \times \frac{\text{size} - \text{size}_{\min}}{\text{size}_{\max} - \text{size}_{\min}}
$$

#### F. Riesgo ML

$$
\text{riesgo\_ml} = P(\text{grave} | \text{features}) \times 100
$$

#### G. Índice de Riesgo Compuesto ⭐

$$
\text{riesgo\_compuesto} = 0.6 \times \text{riesgo\_histórico} + 0.1 \times \text{riesgo\_cluster} + 0.3 \times \text{riesgo\_ml}
$$

#### H. Funciones de Peso para Ruteo

**Distancia:**
$$
w_1 = \text{longitud}
$$

**Balanceado:**
$$
w_2 = \text{longitud} \times \left(1 + \frac{\text{riesgo}}{100}\right)
$$

**Seguro:**
$$
w_3 = \text{longitud} \times \left(1 + \frac{2 \times \text{riesgo}}{100}\right)
$$

### 4.2 Sistemas de Coordenadas

| Sistema | EPSG | Uso |
|---------|------|-----|
| WGS84 | 4326 | Entrada/Salida (lat/lon) |
| UTM Zone 14N | 32614 | DBSCAN (metros) |
| Web Mercator | 3857 | OSM matching (metros) |

**Conversión aproximada en CDMX:**
- 1° latitud ≈ 111 km
- 1° longitud ≈ 104 km (a 19.4°N)

---

## 5. Resultados y Hallazgos

### 5.1 Estadísticas Generales

**Dataset final:**
- **Registros totales (CDMX):** 78,140
- **Periodo:** 2019-2023 (5 años)
- **Accidentes con matching OSM:** 32,139 (41.1%)
- **Tramos viales únicos:** 14,982

**Distribución de gravedad:**
- **Leve (solo daños):** 84.9%
- **Moderada (1-2 heridos):** 12.0%
- **Grave (3+ heridos):** 2.4%
- **Muy grave (con muertos):** 0.7%

### 5.2 Análisis Espacial

**DBSCAN:**
- **Clusters identificados:** 299
- **Puntos en clusters:** 17,178 (53.4%)
- **Puntos de ruido:** 14,961 (46.6%)
- **Cluster más grande:** 487 accidentes

**Hot Spots (Getis-Ord):**
- **Hot Spots 99%:** 13 celdas
- **Hot Spots 95%:** 17 celdas
- **Concentración:** Ejes viales principales (Periférico, Viaducto, Circuito Interior)

**Moran's I:**
- **I = 0.6837** (p < 0.001)
- **Interpretación:** Clustering espacial altamente significativo

### 5.3 Machine Learning

**Feature Selection:**
- **Exploradas:** 60+ columnas
- **Seleccionadas:** 20 features (consenso de 3 algoritmos)

**Modelos:**

| Modelo | Accuracy | Precision | Recall | F1 | AUC |
|--------|----------|-----------|--------|-----|-----|
| Decision Tree | 0.82 | 0.78 | 0.65 | 0.71 | 0.78 |
| Random Forest | 0.87 | 0.85 | 0.72 | 0.78 | 0.84 |
| Logistic Reg | 0.78 | 0.74 | 0.63 | 0.68 | 0.75 |
| **Stacking** | **0.88** | **0.86** | **0.74** | **0.80** | **0.86** |

**Top 5 features más importantes:**
1. `hora` (14.2%)
2. `franja_horaria` (13.4%)
3. `riesgo_cluster` (11.2%)
4. `dia_semana` (9.8%)
5. `mes` (8.7%)

### 5.4 Sistema de Ruteo

**Caso: Zócalo → Polanco**

| Métrica | Más Corta | Balanceada | Más Segura |
|---------|-----------|------------|------------|
| **Distancia (km)** | 8.74 | 9.12 | 10.23 |
| **Riesgo Prom** | 42.3 | 35.8 | 28.5 |
| **Riesgo Máx** | 58.1 | 52.4 | 45.7 |
| **Score Seguridad** | 57.7 | 64.2 | 71.5 |

**Recomendación:** Ruta Más Segura
- Reduce riesgo en 32.6%
- Solo +17% distancia
- ~4 minutos adicionales

---

## 6. Implementación y Reproducibilidad

### 6.1 Instalación

```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd "Proyecto Final Minería"

# Crear entorno virtual (opcional)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install pandas numpy geopandas networkx osmnx folium matplotlib seaborn scikit-learn libpysal esda scipy
```

### 6.2 Ejecución Completa

**Orden de ejecución:**

```bash
# 1. Procesamiento de datos base (15-25 min)
jupyter notebook ProyectoMineria/proceso.ipynb

# 2. Análisis espacial y clustering (5-10 min)
jupyter notebook ProyectoMineria/01_analisis_espacial_clustering.ipynb

# 3. Machine Learning y feature selection (10-15 min)
jupyter notebook ProyectoMineria/02_modelado_ml_causas.ipynb

# 4. DEMO: Sistema de ruteo Zócalo → Polanco (5-10 min) ⭐
jupyter notebook ProyectoMineria/03_sistema_ruteo_zocalo_polanco.ipynb
```

**Tiempo total:** ~40-60 minutos

### 6.3 Verificación de Archivos Generados

```bash
# Verificar estructura de datos
ls -lh ProyectoMineria/"Datos combinados CDMX"/

# Archivos esperados:
# - ACCIDENTES_COMBINADO_CDMX_2019_2023.csv
# - ACCIDENTES_CON_TRAMOS_2019_2023.csv
# - STATS_POR_TRAMO_2019_2023.csv
# - ACCIDENTES_CON_CLUSTERING.csv
# - GRID_HOTSPOTS.csv
# - SCORING_RIESGO_COMPUESTO.csv ⭐

# Verificar modelos
ls -lh ProyectoMineria/modelos/

# Archivos esperados:
# - modelo_riesgo_rf.pkl
# - scaler.pkl
# - feature_names.pkl

# Verificar mapas
ls -lh ProyectoMineria/mapas/

# Archivos esperados:
# - mapa_clusters_dbscan.html
# - mapa_rutas_zocalo_polanco.html ⭐
```

### 6.4 Visualización de Resultados

**Opción 1: Abrir mapas HTML directamente**

```bash
# Mapa de clusters
open ProyectoMineria/mapas/mapa_clusters_dbscan.html

# Mapa de rutas (DEMO principal) ⭐
open ProyectoMineria/mapas/mapa_rutas_zocalo_polanco.html
```

**Opción 2: Ejecutar solo el notebook de demo**

Si ya ejecutaste los notebooks anteriormente y solo quieres ver el resultado final:

```bash
jupyter notebook ProyectoMineria/03_sistema_ruteo_zocalo_polanco.ipynb
```

### 6.5 Requisitos de Sistema

**Mínimos:**
- **RAM:** 8 GB
- **Espacio en disco:** 500 MB (datos + modelos)
- **Python:** 3.8+
- **Sistema operativo:** Windows, Linux, macOS

**Recomendados:**
- **RAM:** 16 GB (para `proceso.ipynb`)
- **CPU:** Multi-core (para Random Forest)
- **Conexión a internet:** Primera ejecución (descarga OSM)

### 6.6 Solución de Problemas Comunes

**Problema 1: Error "No module named 'esda'"**

```bash
pip install esda
```

**Problema 2: OSMnx demora mucho**

- Primera descarga de red vial puede tardar 10-15 minutos
- Se cachea automáticamente en `~/.osmnx/cache`
- Ejecuciones posteriores son rápidas (<1 min)

**Problema 3: Error de memoria en proceso.ipynb**

```python
# Reducir tamaño de datos en memoria
df = df[columnas_esenciales]  # Solo columnas necesarias
del df_temp  # Liberar DataFrames temporales
import gc; gc.collect()  # Garbage collection
```

**Problema 4: Rutas idénticas en notebook 03**

- Asegúrate de que los archivos de riesgo existen:
  - `STATS_POR_TRAMO_2019_2023.csv`
  - `ACCIDENTES_CON_CLUSTERING.csv`
  - `SCORING_RIESGO_COMPUESTO.csv`
- Verifica que la función `asignar_riesgo_a_edges_completo()` se ejecutó correctamente

---

## 7. Conclusiones y Trabajo Futuro

### 7.1 Logros del Proyecto

#### Técnicos

1. **Sistema integral de análisis de accidentes**
   - Procesamiento de 1.04M registros de accidentes
   - Limpieza, transformación y feature engineering completo
   - Integración de 3 fuentes de datos (históricos, espaciales, predictivos)

2. **Análisis espacial estadístico robusto**
   - DBSCAN: 299 clusters identificados
   - Getis-Ord Gi*: 30 hot spots significativos
   - Moran's I: Clustering espacial confirmado (I = 0.6837)

3. **Machine Learning de alto rendimiento**
   - Feature selection con 3 algoritmos (consenso)
   - 4 modelos entrenados (mejor: Stacking, 88% accuracy)
   - Predicción de gravedad con AUC = 0.86

4. **Sistema de ruteo funcional**
   - 3 rutas alternativas con trade-offs claros
   - Reducción de riesgo de hasta 32.6%
   - Visualizaciones interactivas

#### Metodológicos

1. **Proceso KDD completo**
   - Selección → Preprocesamiento → Transformación → Minería → Evaluación
   - Documentación exhaustiva de cada paso
   - Reproducibilidad total

2. **Validación rigurosa**
   - Cross-validation 5-fold
   - Curvas ROC, matrices de confusión
   - Comparación con rutas reales (Google Maps)

3. **Visualización efectiva**
   - Mapas interactivos HTML
   - Perfiles de riesgo
   - Radar charts multidimensionales

#### Prácticos

1. **Aplicabilidad real**
   - Caso de uso concreto (Zócalo → Polanco)
   - Recomendaciones accionables
   - Potencial de integración en apps de navegación

2. **Escalabilidad**
   - Arquitectura modular
   - Archivos optimizados (CSV comprimidos con Git LFS)
   - Posibilidad de actualización periódica

### 7.2 Limitaciones

1. **Datos históricos**
   - Basado en 2019-2023 (requiere actualización)
   - No captura eventos extraordinarios (pandemia COVID-19)

2. **Calidad de datos**
   - Depende de precisión de reportes C5
   - ~40% de accidentes con matching OSM exitoso
   - Posible subregistro de accidentes leves

3. **Factores no capturados**
   - Clima y condiciones meteorológicas
   - Tráfico en tiempo real
   - Estado de infraestructura vial
   - Eventos especiales (manifestaciones, conciertos)

4. **Desbalance de clases**
   - 85% accidentes leves vs 15% graves
   - Puede sesgar modelos hacia clase mayoritaria

5. **Correlación ≠ Causación**
   - Modelos identifican patrones, no causas directas
   - Interpretación requiere conocimiento del dominio

### 7.3 Trabajo Futuro

#### Corto Plazo (3-6 meses)

- [ ] **Validación con datos 2024**
  - Actualizar dataset con año más reciente
  - Re-entrenar modelos
  - Verificar estabilidad de patrones

- [ ] **Desarrollar API REST**
  - Endpoints para cálculo de rutas
  - Input: origen, destino, preferencia (distancia/seguridad)
  - Output: 3 rutas con métricas

- [ ] **Dashboard interactivo**
  - Streamlit o Dash
  - Exploración de hot spots
  - Filtros temporales (hora, día, mes)

- [ ] **Integrar features climáticas**
  - Datos de SMAD (Sistema de Monitoreo Atmosférico)
  - Correlación lluvia-accidentes
  - Actualización de modelos

#### Mediano Plazo (6-12 meses)

- [ ] **Integración con tráfico en tiempo real**
  - API de Waze o Google Maps
  - Recalibración dinámica de riesgo
  - Alertas de congestión

- [ ] **Análisis de series de tiempo**
  - Tendencias temporales
  - Estacionalidad (meses, días festivos)
  - Predicción de accidentes futuros

- [ ] **App móvil iOS/Android**
  - Ruteo seguro nativo
  - Notificaciones push
  - Modo offline (mapas pre-descargados)

- [ ] **Sistema de actualización automática**
  - Pipeline ETL automatizado
  - Re-entrenamiento periódico de modelos
  - Versionado de modelos

#### Largo Plazo (1-2 años)

- [ ] **Sistema de alertas predictivas**
  - Predicción de riesgo en tiempo real
  - Notificaciones preventivas
  - Integración con Waze/C5

- [ ] **Integración oficial con Secretaría de Movilidad CDMX**
  - Acceso a datos en tiempo real
  - Colaboración en políticas públicas
  - Validación con expertos

- [ ] **Modelo de aprendizaje continuo**
  - Online learning con nuevos datos
  - A/B testing de modelos
  - Feedback de usuarios

- [ ] **Expansión a otras ciudades**
  - Guadalajara, Monterrey, Puebla
  - Transferencia de aprendizaje
  - Comparación entre ciudades

### 7.4 Impacto Potencial

**Social:**
- Reducción de accidentes y víctimas
- Mayor conciencia de seguridad vial
- Empoderamiento de ciudadanos con información

**Gubernamental:**
- Identificación de zonas prioritarias para intervención
- Diseño de políticas públicas basadas en evidencia
- Optimización de recursos de seguridad vial

**Económico:**
- Reducción de costos por accidentes (~$1.5B USD anuales en México)
- Menor tiempo perdido en tráfico
- Ahorro en seguros

**Académico:**
- Demostración de aplicación completa de KDD
- Integración de análisis espacial + ML
- Metodología replicable para otras ciudades

---

## 8. Referencias

### 8.1 Datos

- **C5 CDMX** (2025). Base Municipal de Accidentes de Tránsito Georreferenciados. Portal de Datos Abiertos de la Ciudad de México. https://datos.cdmx.gob.mx/

- **OpenStreetMap Contributors** (2025). Planet OSM. https://www.openstreetmap.org/

### 8.2 Algoritmos y Métodos

- **DBSCAN:** Ester, M., Kriegel, H. P., Sander, J., & Xu, X. (1996). A density-based algorithm for discovering clusters in large spatial databases with noise. *KDD*, 96(34), 226-231.

- **Getis-Ord Gi*:** Ord, J. K., & Getis, A. (1995). Local spatial autocorrelation statistics: distributional issues and an application. *Geographical Analysis*, 27(4), 286-306.

- **Moran's I:** Moran, P. A. (1950). Notes on continuous stochastic phenomena. *Biometrika*, 37(1/2), 17-23.

- **Random Forest:** Breiman, L. (2001). Random forests. *Machine Learning*, 45(1), 5-32.

- **Dijkstra:** Dijkstra, E. W. (1959). A note on two problems in connexion with graphs. *Numerische Mathematik*, 1(1), 269-271.

### 8.3 Herramientas

- **Pandas:** McKinney, W. (2010). Data structures for statistical computing in Python. *Proceedings of the 9th Python in Science Conference*, 51-56.

- **scikit-learn:** Pedregosa, F., et al. (2011). Scikit-learn: Machine learning in Python. *JMLR*, 12, 2825-2830.

- **GeoPandas:** Jordahl, K., et al. (2020). GeoPandas: Python tools for geographic data. https://geopandas.org/

- **OSMnx:** Boeing, G. (2017). OSMnx: New methods for acquiring, constructing, analyzing, and visualizing complex street networks. *Computers, Environment and Urban Systems*, 65, 126-139.

- **PySAL:** Rey, S. J., & Anselin, L. (2007). PySAL: A Python library of spatial analytical methods. *The Review of Regional Studies*, 37(1), 5-27.

---

## 9. Autores y Agradecimientos

### 9.1 Equipo del Proyecto

**Proyecto desarrollado como Trabajo Final de Minería de Datos**

### 9.2 Agradecimientos

- **C5 CDMX:** Por proporcionar datos abiertos de accidentes de tránsito
- **OpenStreetMap:** Por la red vial abierta de CDMX
- **Comunidad OSMnx, GeoPandas, scikit-learn:** Por las excelentes herramientas de código abierto

---

## 10. Licencia

Este proyecto es de carácter **académico y de investigación**. Los datos utilizados provienen de fuentes públicas (C5 CDMX, OpenStreetMap).

---

## 11. Contacto

Para más información sobre el proyecto:
- Consultar los notebooks detallados en `ProyectoMineria/`
- Revisar la documentación en `ProyectoMineria/docs/`
- Explorar los mapas interactivos en `ProyectoMineria/mapas/`

---

**⭐ DEMO RECOMENDADA:** Ejecuta `03_sistema_ruteo_zocalo_polanco.ipynb` y abre `mapas/mapa_rutas_zocalo_polanco.html` para ver el sistema en acción.

---

**Última actualización:** 1 de diciembre de 2025
**Versión:** 1.0 (README Global - Proceso KDD Completo)
