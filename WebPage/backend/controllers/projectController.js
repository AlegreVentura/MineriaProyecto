// Project information controller

export const getProjectInfo = (req, res) => {
  try {
    const projectInfo = {
      title: 'Sistema de Ruteo Seguro para CDMX',
      subtitle: 'Análisis Integral de Accidentes de Tránsito (2019-2023)',
      description: 'Sistema completo de análisis de accidentes de tránsito que combina técnicas de minería de datos, análisis espacial y machine learning para mejorar la seguridad vial en la Ciudad de México',

      objectives: [
        'Identificar zonas de alto riesgo vial mediante análisis espacial',
        'Comprender patrones temporales y espaciales de accidentes',
        'Predecir la gravedad de accidentes usando Machine Learning',
        'Calcular rutas alternativas que minimicen el riesgo'
      ],

      dataSources: {
        accidents: {
          source: 'Base Municipal de Accidentes C5 CDMX',
          period: '2019-2023',
          totalRecords: 1042387,
          cdmxRecords: 78140,
          url: 'https://datos.cdmx.gob.mx/'
        },
        roadNetwork: {
          source: 'OpenStreetMap (OSM)',
          nodes: 99728,
          edges: 234532,
          tool: 'OSMnx',
          url: 'https://www.openstreetmap.org/'
        }
      },

      components: [
        {
          name: 'Procesamiento de Datos',
          description: 'Limpieza y consolidación de 1.04M accidentes de tránsito',
          icon: 'database'
        },
        {
          name: 'Análisis Espacial',
          description: 'Clustering DBSCAN, Hot Spots (Getis-Ord Gi*), Autocorrelación (Moran\'s I)',
          icon: 'map'
        },
        {
          name: 'Machine Learning',
          description: 'Predicción de gravedad con Random Forest, Decision Tree, Stacking Ensemble',
          icon: 'brain'
        },
        {
          name: 'Sistema de Ruteo',
          description: 'Cálculo de rutas seguras usando 3 capas de riesgo',
          icon: 'route'
        }
      ],

      technologies: {
        dataMining: ['Python', 'Pandas', 'NumPy', 'scikit-learn'],
        spatial: ['GeoPandas', 'PySAL', 'OSMnx', 'NetworkX'],
        visualization: ['Matplotlib', 'Seaborn', 'Folium', 'Recharts'],
        web: ['React', 'Node.js', 'Express', 'Tailwind CSS']
      }
    }

    res.status(200).json(projectInfo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMethodology = (req, res) => {
  try {
    const methodology = {
      kddProcess: [
        {
          step: 1,
          name: 'Selección de Datos',
          description: 'Adquisición y filtrado de datos de accidentes C5 CDMX y red vial OSM',
          details: [
            '1.04M accidentes (2019-2023)',
            'Filtro geográfico CDMX',
            'Red vial OpenStreetMap',
            'Coordenadas georreferenciadas'
          ]
        },
        {
          step: 2,
          name: 'Preprocesamiento',
          description: 'Limpieza y consolidación de datos para garantizar calidad',
          details: [
            'Eliminación de duplicados (2.6%)',
            'Tratamiento de valores nulos',
            'Validación de coordenadas',
            'Normalización de columnas'
          ]
        },
        {
          step: 3,
          name: 'Transformación',
          description: 'Feature engineering y matching espacial con red vial',
          details: [
            'Features temporales (hora, día, mes)',
            'Índice de severidad: 10×muertos + 3×heridos',
            'Matching con red vial OSM (KDTree)',
            'Agregación por tramo vial (14,982 tramos)'
          ]
        },
        {
          step: 4,
          name: 'Minería de Datos',
          description: 'Aplicación de técnicas de análisis espacial y machine learning',
          details: [
            'DBSCAN: 299 clusters (eps=200m)',
            'Getis-Ord Gi*: 30 hot spots',
            'Random Forest: 88% accuracy',
            'Índice riesgo: 60% hist + 30% ML + 10% cluster'
          ]
        },
        {
          step: 5,
          name: 'Interpretación/Evaluación',
          description: 'Sistema de ruteo seguro con 3 alternativas optimizadas',
          details: [
            'Integración 3 capas de riesgo',
            'Algoritmo de Dijkstra',
            'Rutas: Corta, Balanceada, Segura',
            'Reducción de riesgo hasta 32.6%'
          ]
        }
      ],

      techniques: {
        spatial: [
          {
            name: 'DBSCAN',
            formula: 'eps=200m, min_samples=20',
            result: '299 clusters, 53.4% de puntos agrupados'
          },
          {
            name: 'Getis-Ord Gi*',
            formula: 'Hot Spot Analysis con cuadrícula 0.01°',
            result: '13 hot spots (99%), 17 hot spots (95%)'
          },
          {
            name: 'Moran\'s I',
            formula: 'I = 0.6837 (p < 0.001)',
            result: 'Clustering espacial altamente significativo'
          }
        ],
        machineLearning: [
          {
            name: 'Feature Selection',
            method: 'Consenso de 3 algoritmos (SelectKBest, RFE, Importance)',
            result: '60+ features → 20 seleccionadas'
          },
          {
            name: 'Random Forest',
            performance: 'Accuracy: 87%, AUC: 0.84',
            features: 'n_estimators=100, max_depth=10'
          },
          {
            name: 'Stacking Ensemble',
            performance: 'Accuracy: 88%, AUC: 0.86',
            architecture: 'DT + RF + LR → LR meta-learner'
          }
        ],
        routing: [
          {
            name: 'Dijkstra',
            description: 'Camino mínimo con 3 funciones de peso',
            complexity: 'O((V + E) log V)'
          },
          {
            name: 'Riesgo Compuesto',
            formula: '0.6×histórico + 0.1×clustering + 0.3×ML',
            justification: 'Prioriza datos reales, complementa con predicción'
          }
        ]
      },

      formulas: {
        severity: 'severidad = 10 × muertos + 3 × heridos',
        clusterRisk: 'riesgo_cluster = 50 + 50 × (size - min) / (max - min)',
        mlRisk: 'riesgo_ml = P(grave | features) × 100',
        compositeRisk: 'riesgo_compuesto = 0.6×riesgo_histórico + 0.1×riesgo_cluster + 0.3×riesgo_ml',
        weightShort: 'w_corta = longitud',
        weightBalanced: 'w_balanceada = longitud × (1 + riesgo/100)',
        weightSafe: 'w_segura = longitud × (1 + 2×riesgo/100)'
      }
    }

    res.status(200).json(methodology)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getResults = (req, res) => {
  try {
    const results = {
      generalStats: {
        totalRecords: 78140,
        period: '2019-2023',
        matchedToRoad: 32139,
        uniqueRoadSegments: 14982
      },

      spatialAnalysis: {
        dbscan: {
          clusters: 299,
          pointsInClusters: 17178,
          percentageInClusters: 53.4,
          noisePoints: 14961,
          largestCluster: 487
        },
        hotspots: {
          significant99: 13,
          significant95: 17,
          totalCells: 755,
          cellSize: '0.01° (~1.1 km)'
        },
        moranI: {
          value: 0.6837,
          pValue: '<0.001',
          interpretation: 'Clustering espacial altamente significativo'
        }
      },

      machineLearning: {
        models: [
          {
            name: 'Decision Tree',
            accuracy: 0.82,
            precision: 0.78,
            recall: 0.65,
            f1Score: 0.71,
            auc: 0.78
          },
          {
            name: 'Random Forest',
            accuracy: 0.87,
            precision: 0.85,
            recall: 0.72,
            f1Score: 0.78,
            auc: 0.84
          },
          {
            name: 'Logistic Regression',
            accuracy: 0.78,
            precision: 0.74,
            recall: 0.63,
            f1Score: 0.68,
            auc: 0.75
          },
          {
            name: 'Stacking Ensemble',
            accuracy: 0.88,
            precision: 0.86,
            recall: 0.74,
            f1Score: 0.80,
            auc: 0.86,
            best: true
          }
        ],
        topFeatures: [
          { name: 'hora', importance: 14.2 },
          { name: 'franja_horaria', importance: 13.4 },
          { name: 'riesgo_cluster', importance: 11.2 },
          { name: 'dia_semana', importance: 9.8 },
          { name: 'mes', importance: 8.7 }
        ],
        featureSelection: {
          explored: 60,
          selected: 20,
          method: 'Consenso de 3 algoritmos'
        }
      },

      routing: {
        example: 'Zócalo → Polanco',
        routes: [
          {
            type: 'shortest',
            name: 'Más Corta',
            distance: 8.74,
            avgRisk: 42.3,
            maxRisk: 58.1,
            segments: 67,
            safetyScore: 57.7,
            color: 'blue'
          },
          {
            type: 'balanced',
            name: 'Balanceada',
            distance: 9.12,
            avgRisk: 35.8,
            maxRisk: 52.4,
            segments: 72,
            safetyScore: 64.2,
            color: 'orange'
          },
          {
            type: 'safest',
            name: 'Más Segura',
            distance: 10.23,
            avgRisk: 28.5,
            maxRisk: 45.7,
            segments: 81,
            safetyScore: 71.5,
            color: 'green',
            recommended: true
          }
        ],
        tradeoffs: {
          additionalDistance: 1.49,
          additionalDistancePercent: 17.0,
          riskReduction: 13.8,
          riskReductionPercent: 32.6,
          additionalTime: 4,
          value: 'Mucho más seguro con costo mínimo en tiempo'
        }
      }
    }

    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
