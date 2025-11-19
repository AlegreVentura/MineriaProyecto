# Scripts Auxiliares

Esta carpeta contiene scripts de Python utilizados para desarrollo y pruebas del proyecto.

## Archivos

### funcion_asignar_tramos_FINAL.py
Función corregida para asignar accidentes a tramos de calle del grafo vial OSM.

**Problema resuelto**: Proyección incorrecta de coordenadas (CRS mismatch entre puntos y edges del grafo).

**Solución**: Proyectar los puntos al mismo CRS que los edges del grafo (EPSG:32614).

**Uso**: Este código ya está integrado en el notebook principal (proceso.ipynb).
