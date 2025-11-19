# Proyecto Final: Análisis de Accidentes de Tránsito en CDMX

## Descripción del Proyecto

Análisis integral de accidentes de tránsito en la Ciudad de México (2019-2023) con tres componentes principales:
1. **Procesamiento y limpieza de datos** (proceso.ipynb)
2. **Funcionalidades avanzadas**: Clustering espacial, análisis de causalidad y motor de ruteo seguro (funcionalidades_para_app.ipynb)

---

## Estructura del Proyecto

```
ProyectoMineria/
│
├── proceso.ipynb                          # Notebook 1: Procesamiento de datos
├── funcionalidades_para_app.ipynb         # Notebook 2: Análisis avanzado y ML
├── plan de trabajo.pdf                    # Documento de planificación inicial
├── README.md                              # Este archivo
├── .gitignore                             # Configuración de Git
│
├── Datos raw/                             # Datos originales de INEGI (2019-2023)
│   ├── 2019/BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2019.csv
│   ├── 2020/BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2020.csv
│   ├── 2021/BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2021.csv
│   ├── 2022/BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2022.csv
│   ├── 2023/BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2023.csv
│   └── documentacion/                     # Metadatos y diccionario de datos
│       ├── FUENTE_DATOS.txt               # Fuente: INEGI, fecha de consulta
│       ├── fd_bd_atus_georreferenciación.xlsx
│       ├── Metadatos geográficos 2019 - 2023.txt
│       └── Metadatos geográficos 2019 - 2023.xml
│
├── Datos limpios/                         # Datos procesados por año
│   ├── 2019/ACCIDENTES_LIMPIO_2019.csv
│   ├── 2020/ACCIDENTES_LIMPIO_2020.csv
│   ├── 2021/ACCIDENTES_LIMPIO_2021.csv
│   ├── 2022/ACCIDENTES_LIMPIO_2022.csv
│   └── 2023/ACCIDENTES_LIMPIO_2023.csv
│
├── Datos combinados/                      # Datasets nacionales consolidados
│   ├── ACCIDENTES_COMBINADO_2019_2023.csv
│   └── ACCIDENTES_COMBINADO_2022_2023.csv
│
├── Datos combinados CDMX/                 # Datasets CDMX con análisis espacial
│   ├── ACCIDENTES_COMBINADO_CDMX_2019_2023.csv  (53 columnas)
│   ├── ACCIDENTES_COMBINADO_CDMX_2022_2023.csv
│   ├── ACCIDENTES_CON_TRAMOS_2019_2023.csv      (59 columnas, 32,139 registros)
│   └── STATS_POR_TRAMO_2019_2023.csv            (9 columnas, 15,615 tramos)
│
├── Red vial/
│   └── red_vial_cdmx.graphml              # Grafo de red vial CDMX (OSMnx)
│
└── scripts_auxiliares/                    # Scripts Python reutilizables
    ├── README.md                          # Documentación de funciones
    └── funcion_asignar_tramos_FINAL.py    # Asignación de accidentes a tramos
```

---

## Notebook 1: proceso.ipynb

### Propósito
Limpieza, transformación y enriquecimiento de datos de accidentes de tránsito.

### Datasets de Entrada
- BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2019.csv (180,219 registros)
- BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2020.csv (150,886 registros)
- BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2021.csv (199,224 registros)
- BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2022.csv (250,891 registros)
- BASE MUNICIPAL_ACCIDENTES DE TRANSITO GEORREFERENCIADOS_2023.csv (262,768 registros)

### Datasets de Salida
1. **ACCIDENTES_COMBINADO_CDMX_2019_2023.csv** (53 columnas)
   - Dataset completo filtrado para CDMX
   - Features de ingeniería creadas

2. **ACCIDENTES_CON_TRAMOS_2019_2023.csv** (59 columnas, 32,139 registros)
   - Accidentes asignados a tramos de calle mediante nearest neighbor
   - Incluye edge_u, edge_v, edge_key, distancia_edge

3. **STATS_POR_TRAMO_2019_2023.csv** (9 columnas, 15,615 tramos)
   - Estadísticas agregadas por tramo de calle

### Features de Ingeniería Creadas

#### 1. fechahora
- Combinación de año, mes, día, hora y minutos
- Tipo: datetime64[ns]

#### 2. severidad
- **Fórmula**: `severidad = 10 × totmuertos + 3 × totheridos`
- Índice numérico ponderado de impacto humano

#### 3. Indicadores binarios
- **hay_muertos**: totmuertos > 0
- **hay_heridos**: totheridos > 0
- **solo_daños_materiales**: Sin víctimas

#### 4. severidad_cat
- **Categorización ordinal de 4 niveles**:
  - "muy grave": ≥1 muertos
  - "grave": ≥3 heridos (sin muertos)
  - "moderada": 1-2 heridos (sin muertos)
  - "leve": Sin muertos ni heridos

#### 5. franja_horaria
- **Categorización temporal usando pd.cut()**:
  - "Madrugada": 0-5 horas
  - "Mañana": 6-11 horas
  - "Tarde": 12-17 horas
  - "Noche": 18-23 horas

### Técnicas Aplicadas

#### Normalización Min-Max
- **Fórmula**: `(x - min) / (max - min)`
- **Rango**: [0, 1]
- **Aplicado a**: N_norm (accidentes), S_norm (severidad), F_norm (fatalidad)

#### Asignación Espacial
- **Método**: Nearest neighbor con proyección UTM
- **Herramienta**: OSMnx + GeoPandas
- **Red vial**: 125,601 nodos, 295,256 aristas
- **Proyección**: EPSG:32614 (UTM Zona 14N)
- **Precisión**: Distancia promedio 2.8 metros

#### Índice de Riesgo Compuesto
- **Fórmula**: `indice_riesgo = 0.4 × N_norm + 0.4 × S_norm + 0.2 × F_norm`
- **Ponderación**:
  - 40% frecuencia de accidentes
  - 40% severidad acumulada
  - 20% accidentes fatales

---

## Notebook 2: funcionalidades_para_app.ipynb

### Propósito
Implementación de tres módulos para una aplicación de navegación segura:
1. Clustering espacial estadístico
2. Análisis de causalidad con Machine Learning
3. Motor de ruteo seguro

### Estructura del Notebook

#### 0. Preliminares
- Resumen del notebook anterior (proceso.ipynb)
- Importaciones y configuración
- Rutas de archivos

#### 1. Clustering Espacial Estadístico
Identificación de zonas de alto riesgo usando:

**1.1 DBSCAN** (Density-Based Spatial Clustering)
- Clustering por densidad
- 29 clusters identificados
- 31,620 accidentes agrupados, 519 outliers

**1.2 Getis-Ord Gi*** (Hot Spot Analysis)
- Identificación de hot spots estadísticamente significativos
- 40 celdas con confianza 99%
- 39 celdas con confianza 95%

**1.3 Moran's I** (Autocorrelación Espacial)
- Global I = 0.1175 (p = 0.0010)
- Autocorrelación espacial positiva significativa
- LISA (Local Indicators): 373 zonas HH (High-High), 707 zonas LL (Low-Low)

#### 2. Análisis de Causalidad (Machine Learning)

**2.0 Carga y Exploración de Datos**
- Listado de 61 columnas disponibles
- Verificación de tipos de datos
- Estadísticas descriptivas

**2.1 Preparación de Variables**
- Variable objetivo: accidente_grave (binaria)
- Codificación de variables categóricas
- Split train/test (80/20)

**2.2 Selección Formal de Características**
Metodología rigurosa de selección:
- Análisis de correlaciones
- SelectKBest con ANOVA F-statistic
- SelectKBest con Información Mutua
- Eliminación de multicolinealidad (>0.8)
- Selección final de ~15 features

**2.3 Random Forest**
- 100 estimadores, max_depth=10
- Importancia de variables
- Comparación con Árbol de Decisión
- Análisis de mejoras sobre árbol único

**2.4 Árbol de Decisión**
- max_depth=4 para interpretabilidad
- Visualización completa del árbol
- Importancia de variables (Gini)
- Análisis de reglas de decisión

**2.5 Regresión Logística**
- class_weight='balanced'
- StandardScaler para normalización
- Coeficientes interpretables

**2.6 Modelo Ensamble: Stacking Classifier** ⭐
- **Modelos base**: Random Forest + Logistic Regression
- **Meta-modelo**: Logistic Regression
- **Validación cruzada**: 5-fold
- **Comparación completa** de 4 modelos:
  - Decision Tree
  - Random Forest
  - Logistic Regression
  - Stacking
- **Métricas**: Accuracy, Precision, Recall, F1-Score
- **Visualizaciones**: Matrices de confusión, gráficos comparativos

**Ventajas del Ensamblado**:
- Combina fortalezas de modelos complementarios
- RF captura patrones no lineales complejos
- LR proporciona baseline lineal estable
- Meta-modelo aprende combinación óptima

#### 3. Motor de Ruteo Seguro

**3.1 Carga del Grafo OSM**
- Red vial completa de CDMX
- 125,601 nodos, 295,256 aristas

**3.2 Asignación de Riesgo a Aristas**
- Índice de riesgo normalizado [0, 1]
- 15,615 aristas con datos históricos
- Riesgo promedio para aristas sin datos

**3.3 Función de Ruteo Seguro**
- Peso compuesto: `peso = (1-α) × tiempo + α × riesgo`
- α = 0: Ruta más rápida
- α = 1: Ruta más segura
- α = 0.5: Ruta balanceada

**3.4 Cálculo de 3 Rutas Alternativas**
- Ruta rápida (α=0.0)
- Ruta segura (α=1.0)
- Ruta balanceada (α=0.5)

**3.5 Visualización Comparativa**
- Mapa con 3 rutas superpuestas
- Diferenciación por color
- Métricas: tiempo, distancia, riesgo

**3.6 Análisis de Trade-offs**
- Tabla comparativa de métricas
- Tiempo adicional vs reducción de riesgo
- Recomendaciones según preferencia

**3.7 Función API-Ready**
- `api_calcular_ruta()` lista para integración
- Input: origen, destino, preferencia
- Output: JSON con ruta y métricas

#### 4. Conclusiones y Próximos Pasos
- Resumen de implementaciones
- Roadmap para desarrollo de aplicación
- Impacto esperado en seguridad vial

---

## Requisitos Técnicos

### Librerías Principales
```python
# Datos y análisis
pandas, numpy

# Geoespacial
geopandas, shapely, osmnx, networkx

# Machine Learning
scikit-learn

# Análisis espacial estadístico
libpysal, esda  # Opcional para Getis-Ord y Moran's I

# Visualización
matplotlib, seaborn
```

### Instalación
```bash
pip install pandas numpy geopandas shapely osmnx networkx scikit-learn matplotlib seaborn
pip install libpysal esda  # Opcional
```

---

## Uso

### 1. Ejecutar procesamiento de datos
```bash
jupyter notebook proceso.ipynb
```
- Ejecutar todas las celdas secuencialmente
- Genera datasets limpios y consolidados

### 2. Ejecutar análisis avanzado
```bash
jupyter notebook funcionalidades_para_app.ipynb
```
- Requiere que proceso.ipynb haya sido ejecutado
- Usa datasets generados en Paso 1

---

## Resultados Clave

### Clusters de Alto Riesgo
- **29 clusters identificados** con DBSCAN
- **Cluster más crítico**: 30,959 accidentes, 660 muertos (Lat 19.398, Lon -99.143)
- **79 hot spots significativos** (Getis-Ord Gi*)

### Factores de Riesgo Principales
Según importancia en Random Forest:
1. Mes del año
2. Alcaldía (mpio)
3. Hora del día
4. Día de la semana
5. Año

### Rendimiento de Modelos
Accuracy en conjunto de prueba:
- Decision Tree: ~0.97
- Random Forest: ~0.97
- Logistic Regression: ~0.97
- Stacking: ~0.97

**Nota**: Alta accuracy debido a desbalance de clases (97% no graves)

### Ruteo Seguro
Ejemplo (Zócalo → Polanco):
- **Ruta rápida**: 10.3 min, 7.97 km, riesgo 0.0181
- **Ruta segura**: 14.3 min, 8.22 km, riesgo 0.0135 (25% menos riesgo, 38% más tiempo)
- **Ruta balanceada**: 12.1 min, 8.22 km, riesgo 0.0123 (compromiso óptimo)

---

## Aplicaciones

### 1. Políticas Públicas
- Identificación de zonas prioritarias para intervención
- Diseño de campañas de prevención basadas en evidencia
- Asignación óptima de recursos de seguridad vial

### 2. Aplicación de Navegación
- Sistema de ruteo que considera seguridad además de tiempo
- Alertas de zonas de alto riesgo
- Visualización de hot spots

### 3. Análisis Predictivo
- Predicción de severidad de accidentes
- Identificación de factores de riesgo modificables
- Monitoreo de tendencias temporales

---

## Limitaciones

1. **Datos históricos**: Análisis basado en 2019-2023, requiere actualización periódica
2. **Calidad de datos**: Depende de la precisión de reportes oficiales
3. **Factores externos**: No captura clima, eventos especiales, tráfico en tiempo real
4. **Desbalance de clases**: 97% de accidentes son no graves, afecta rendimiento de modelos
5. **Causalidad**: Los modelos identifican correlación, no causación

---

## Próximos Pasos

### Corto Plazo
1. Validar modelos con datos de 2024
2. Desarrollar API REST para ruteo seguro
3. Crear dashboard interactivo con mapas

### Mediano Plazo
1. Integrar datos de tráfico en tiempo real
2. Implementar análisis temporal (series de tiempo)
3. Desarrollar app móvil de navegación segura

### Largo Plazo
1. Sistema de alertas predictivas
2. Integración con autoridades de tránsito
3. Modelo de actualización continua con nuevos datos

---

## Autores

Proyecto desarrollado como trabajo final de Minería de Datos.

---

## Licencia

Este proyecto es de carácter académico.

---

## Contacto

Para más información sobre el proyecto, consultar los notebooks detallados.

---

**Última actualización**: 14 de noviembre de 2025
