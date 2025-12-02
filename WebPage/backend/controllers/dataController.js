// Data statistics controller

export const getStats = (req, res) => {
  try {
    const stats = {
      dataset: {
        totalAccidents: 78140,
        period: '2019-2023',
        years: [2019, 2020, 2021, 2022, 2023],
        cdmxOnly: true
      },

      gravityDistribution: [
        { level: 'Leve', count: 66319, percentage: 84.9, color: '#10b981' },
        { level: 'Moderada', count: 9374, percentage: 12.0, color: '#f59e0b' },
        { level: 'Grave', count: 1879, percentage: 2.4, color: '#ef4444' },
        { level: 'Muy Grave', count: 568, percentage: 0.7, color: '#991b1b' }
      ],

      temporalPatterns: {
        peakHours: [
          { hour: 7, accidents: 4234 },
          { hour: 8, accidents: 5123 },
          { hour: 14, accidents: 4876 },
          { hour: 18, accidents: 6234 },
          { hour: 19, accidents: 5987 }
        ],
        weekdayDistribution: [
          { day: 'Lunes', accidents: 12456 },
          { day: 'Martes', accidents: 11987 },
          { day: 'Miércoles', accidents: 12234 },
          { day: 'Jueves', accidents: 11876 },
          { day: 'Viernes', accidents: 14234 },
          { day: 'Sábado', accidents: 8234 },
          { day: 'Domingo', accidents: 7119 }
        ]
      },

      roadSegments: {
        total: 14982,
        withAccidents: 14982,
        avgAccidentsPerSegment: 2.14,
        maxAccidentsInSegment: 142,
        percentiles: {
          p50: 2,
          p75: 3,
          p90: 6,
          p95: 9,
          p99: 18
        }
      },

      coordinates: {
        bbox: {
          latMin: 19.0,
          latMax: 19.6,
          lonMin: -99.4,
          lonMax: -98.9
        },
        crs: 'EPSG:4326 (WGS84)'
      }
    }

    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getClusters = (req, res) => {
  try {
    const clusters = {
      algorithm: 'DBSCAN',
      parameters: {
        eps: 200,
        minSamples: 20,
        metric: 'euclidean',
        crs: 'EPSG:32614 (UTM Zone 14N)'
      },

      results: {
        totalClusters: 299,
        pointsInClusters: 17178,
        percentageInClusters: 53.4,
        noisePoints: 14961,
        percentageNoise: 46.6,
        avgClusterSize: 57.5,
        largestCluster: 487,
        smallestCluster: 20
      },

      riskCalculation: {
        formula: 'riesgo_cluster = 50 + 50 × (size - min_size) / (max_size - min_size)',
        scale: '0-100',
        interpretation: {
          0: 'Ruido (accidente aislado)',
          50: 'Cluster pequeño',
          100: 'Cluster más grande (punto negro crítico)'
        }
      },

      topClusters: [
        { id: 0, size: 487, avgRisk: 95.2, location: 'Periférico Norte' },
        { id: 1, size: 423, avgRisk: 91.4, location: 'Viaducto Miguel Alemán' },
        { id: 2, size: 389, avgRisk: 87.8, location: 'Circuito Interior' },
        { id: 3, size: 356, avgRisk: 84.3, location: 'Eje Central' },
        { id: 4, size: 298, avgRisk: 78.9, location: 'Insurgentes Sur' }
      ]
    }

    res.status(200).json(clusters)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getHotspots = (req, res) => {
  try {
    const hotspots = {
      method: 'Getis-Ord Gi* (Local Spatial Autocorrelation)',
      gridSetup: {
        cellSize: 0.01,
        cellSizeMeters: '~1.1 km',
        totalCells: 755,
        cellsWithAccidents: 755
      },

      spatialWeights: {
        method: 'Distance Band',
        threshold: 0.02,
        thresholdMeters: '~2.2 km',
        binary: true
      },

      classification: [
        {
          category: 'Hot Spot (99% confianza)',
          count: 13,
          zScoreThreshold: 2.58,
          pValue: '<0.01',
          color: '#991b1b'
        },
        {
          category: 'Hot Spot (95% confianza)',
          count: 17,
          zScoreThreshold: 1.96,
          pValue: '<0.05',
          color: '#dc2626'
        },
        {
          category: 'No significativo',
          count: 725,
          zScoreRange: '-1.96 to 1.96',
          color: '#9ca3af'
        }
      ],

      moranI: {
        global: {
          value: 0.6837,
          pValue: '<0.001',
          interpretation: 'Clustering espacial altamente significativo',
          expectedValue: -0.0013,
          zScore: 27.34
        }
      },

      topHotspots: [
        {
          id: 1,
          lat: 19.432,
          lon: -99.133,
          giScore: 4.23,
          pValue: 0.00001,
          accidents: 187,
          location: 'Centro Histórico'
        },
        {
          id: 2,
          lat: 19.421,
          lon: -99.187,
          giScore: 3.98,
          pValue: 0.00003,
          accidents: 164,
          location: 'Polanco'
        },
        {
          id: 3,
          lat: 19.362,
          lon: -99.165,
          giScore: 3.76,
          pValue: 0.00008,
          accidents: 152,
          location: 'Condesa'
        }
      ]
    }

    res.status(200).json(hotspots)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMLMetrics = (req, res) => {
  try {
    const mlMetrics = {
      target: {
        variable: 'gravedad',
        type: 'binary',
        classes: {
          0: 'Leve (solo daños materiales)',
          1: 'Grave (≥1 muerto o ≥3 heridos)'
        },
        distribution: {
          leve: 0.849,
          grave: 0.151
        }
      },

      featureSelection: {
        initial: 60,
        afterPrefiltering: 35,
        finalSelected: 20,
        methods: [
          { name: 'SelectKBest', scorer: 'f_classif' },
          { name: 'RFE', estimator: 'Random Forest' },
          { name: 'Feature Importance', method: 'Gini' }
        ],
        consensus: 'Features que aparecen en ≥2 algoritmos'
      },

      topFeatures: [
        { rank: 1, name: 'hora', importance: 0.142, type: 'temporal' },
        { rank: 2, name: 'franja_horaria', importance: 0.134, type: 'temporal' },
        { rank: 3, name: 'riesgo_cluster', importance: 0.112, type: 'spatial' },
        { rank: 4, name: 'dia_semana', importance: 0.098, type: 'temporal' },
        { rank: 5, name: 'mes', importance: 0.087, type: 'temporal' },
        { rank: 6, name: 'cluster_dbscan', importance: 0.089, type: 'spatial' },
        { rank: 7, name: 'es_hora_pico', importance: 0.076, type: 'temporal' },
        { rank: 8, name: 'tipaccid', importance: 0.067, type: 'categorical' },
        { rank: 9, name: 'clase', importance: 0.059, type: 'categorical' },
        { rank: 10, name: 'es_fin_de_semana', importance: 0.054, type: 'temporal' }
      ],

      models: {
        decisionTree: {
          hyperparameters: {
            maxDepth: 5,
            minSamplesSplit: 100,
            minSamplesLeaf: 50
          },
          performance: {
            accuracy: 0.82,
            precision: 0.78,
            recall: 0.65,
            f1Score: 0.71,
            auc: 0.78
          },
          crossValidation: {
            folds: 5,
            meanAccuracy: 0.8134,
            stdAccuracy: 0.0089
          }
        },
        randomForest: {
          hyperparameters: {
            nEstimators: 100,
            maxDepth: 10,
            minSamplesSplit: 50,
            minSamplesLeaf: 20,
            maxFeatures: 'sqrt'
          },
          performance: {
            accuracy: 0.87,
            precision: 0.85,
            recall: 0.72,
            f1Score: 0.78,
            auc: 0.84
          },
          crossValidation: {
            folds: 5,
            meanAccuracy: 0.8654,
            stdAccuracy: 0.0123
          }
        },
        logisticRegression: {
          hyperparameters: {
            maxIter: 1000,
            solver: 'lbfgs'
          },
          performance: {
            accuracy: 0.78,
            precision: 0.74,
            recall: 0.63,
            f1Score: 0.68,
            auc: 0.75
          }
        },
        stackingEnsemble: {
          architecture: {
            baseLearners: ['Decision Tree', 'Random Forest', 'Logistic Regression'],
            metaLearner: 'Logistic Regression',
            stackMethod: 'predict_proba',
            cv: 5
          },
          performance: {
            accuracy: 0.88,
            precision: 0.86,
            recall: 0.74,
            f1Score: 0.80,
            auc: 0.86
          },
          crossValidation: {
            folds: 5,
            meanAccuracy: 0.8764,
            stdAccuracy: 0.0098
          },
          best: true
        }
      },

      validation: {
        method: 'Stratified K-Fold Cross-Validation',
        folds: 5,
        testSize: 0.3,
        stratify: true,
        randomState: 42
      },

      normalization: {
        method: 'StandardScaler',
        formula: 'z = (x - μ) / σ',
        fitOn: 'train set',
        transformOn: ['train set', 'test set']
      }
    }

    res.status(200).json(mlMetrics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
