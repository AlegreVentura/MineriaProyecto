# FUNCIÓN FINAL CORREGIDA - Lista para copiar al notebook
# Copia todo esto en una celda del notebook

import pandas as pd
import numpy as np
import geopandas as gpd
import osmnx as ox

def asignar_accidentes_a_tramos(df_accidentes, grafo):
    """
    Asigna cada accidente al tramo de calle (edge) más cercano del grafo vial.

    Parámetros:
    -----------
    df_accidentes : DataFrame o GeoDataFrame
        DataFrame con accidentes que debe tener columnas 'longitud' y 'latitud'
    grafo : networkx.MultiDiGraph
        Grafo vial de OSMnx

    Retorna:
    --------
    GeoDataFrame con columnas adicionales:
        - edge_u: nodo origen del tramo
        - edge_v: nodo destino del tramo
        - edge_key: clave del edge (para MultiDiGraph)
        - distancia_edge: distancia en metros del punto al tramo
    """
    print(f"Asignando {len(df_accidentes)} accidentes a tramos...")

    # Convertir a GeoDataFrame si no lo es
    if not isinstance(df_accidentes, gpd.GeoDataFrame):
        gdf = gpd.GeoDataFrame(
            df_accidentes,
            geometry=gpd.points_from_xy(df_accidentes['longitud'],
                                       df_accidentes['latitud']),
            crs='EPSG:4326')
    else:
        gdf = df_accidentes.copy()

    # Proyectar grafo y obtener edges como GeoDataFrame
    G_proj = ox.project_graph(grafo)
    edges_gdf = ox.graph_to_gdfs(G_proj, nodes=False, edges=True)

    print(f"Grafo: {len(edges_gdf)} tramos en CRS {edges_gdf.crs}")

    # CRÍTICO: Proyectar puntos al MISMO CRS que los edges
    gdf_proj = gdf.to_crs(edges_gdf.crs)

    # Encontrar edge más cercano para cada punto
    edges_asignados = []
    distancias = []

    total = len(gdf_proj)
    for idx in range(total):
        punto = gdf_proj.iloc[idx].geometry

        # Calcular distancia a todos los edges
        dists = edges_gdf.geometry.distance(punto)
        min_idx = dists.idxmin()  # Retorna tupla (u, v, key)

        edges_asignados.append(min_idx)
        distancias.append(dists[min_idx])

        # Mostrar progreso cada 1000 registros
        if (idx + 1) % 1000 == 0 or (idx + 1) == total:
            print(f"  Progreso: {idx+1}/{total} ({100*(idx+1)/total:.1f}%)")

    # Agregar resultados al dataframe original
    gdf['edge_u'] = [e[0] for e in edges_asignados]
    gdf['edge_v'] = [e[1] for e in edges_asignados]
    gdf['edge_key'] = [e[2] for e in edges_asignados]
    gdf['distancia_edge'] = distancias

    # Estadísticas finales
    tramos_unicos = gdf[['edge_u','edge_v','edge_key']].drop_duplicates().shape[0]
    dist_prom = np.mean(distancias)
    dist_max = np.max(distancias)

    print(f"\nRESULTADO:")
    print(f"  - Accidentes procesados: {len(gdf)}")
    print(f"  - Tramos únicos asignados: {tramos_unicos}")
    print(f"  - Distancia promedio al tramo: {dist_prom:.2f} m")
    print(f"  - Distancia máxima al tramo: {dist_max:.2f} m")

    return gdf


def calcular_stats_por_tramo(df_con_tramos):
    """
    Calcula estadísticas de accidentes por tramo de calle
    """
    stats_tramos = df_con_tramos.groupby(['edge_u', 'edge_v', 'edge_key']).agg(
        accidentes_totales=('id', 'size'),
        severidad_total=('severidad', 'sum'),
        muertos_totales=('totmuertos', 'sum'),
        heridos_totales=('totheridos', 'sum'),
        accidentes_graves=('hay_muertos', 'sum'),
        distancia_prom_edge=('distancia_edge', 'mean')).reset_index()

    print(f"\nEstadísticas calculadas para {len(stats_tramos)} tramos")
    print(f"\nTop 10 tramos más peligrosos por severidad:")
    print(stats_tramos.nlargest(10, 'severidad_total')[
        ['edge_u', 'edge_v', 'accidentes_totales', 'muertos_totales',
         'heridos_totales', 'severidad_total']])

    return stats_tramos


# == EJEMPLO DE USO ==

# Cargar datos si no los tienes cargados
if 'df_cdmx_2019_2023' not in globals():
    df_cdmx_2019_2023 = pd.read_csv("Datos combinados CDMX/ACCIDENTES_COMBINADO_CDMX_2019_2023.csv",
                                     parse_dates=["fechahora"], low_memory=False)
if 'G_cdmx2' not in globals():
    G_cdmx2 = ox.load_graphml("Red vial/red_vial_cdmx.graphml")

# PRUEBA con 100 accidentes primero
print(" PRUEBA CON 100 ACCIDENTES \n")
df_test = asignar_accidentes_a_tramos(df_cdmx_2019_2023.head(100), G_cdmx2)

print("\nPrimeros 10 resultados:")
print(df_test[['id', 'longitud', 'latitud', 'edge_u', 'edge_v',
               'distancia_edge']].head(10))

# Calcular estadísticas por tramo
stats_test = calcular_stats_por_tramo(df_test)

# Si la prueba funcionó bien, procesar el dataset completo
# df_completo = asignar_accidentes_a_tramos(df_cdmx_2019_2023, G_cdmx2)
