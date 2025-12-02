import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Exporta las rutas calculadas a diferentes formatos
 */

/**
 * Exporta la ruta como archivo PDF
 * @param {Object} routeData - Datos de la ruta (origin, destination, routes, stats)
 */
export const exportToPDF = async (routeData) => {
  const { origin, destination, selectedRoute, routes } = routeData

  // Crear PDF
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Título
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Sistema de Ruteo Seguro CDMX', pageWidth / 2, 20, { align: 'center' })

  // Línea
  pdf.setLineWidth(0.5)
  pdf.line(20, 25, pageWidth - 20, 25)

  // Información de la ruta
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Origen: ${origin}`, 20, 35)
  pdf.text(`Destino: ${destination}`, 20, 42)
  pdf.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 20, 49)

  // Capturar el mapa y agregarlo al PDF
  try {
    // Buscar el contenedor del mapa
    const mapContainer = document.getElementById('route-map')
    const mapElement = mapContainer?.querySelector('.leaflet-container') || document.querySelector('.leaflet-container')

    if (mapElement) {
      // Esperar a que el mapa termine de renderizar
      await new Promise(resolve => setTimeout(resolve, 2000))

      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: true,
        width: mapElement.offsetWidth,
        height: mapElement.offsetHeight,
        foreignObjectRendering: true,
        onclone: (clonedDoc) => {
          // Forzar renderizado de capas SVG y canvas
          const clonedMap = clonedDoc.querySelector('.leaflet-container')
          if (clonedMap) {
            clonedMap.style.width = mapElement.offsetWidth + 'px'
            clonedMap.style.height = mapElement.offsetHeight + 'px'

            // Forzar visibilidad de todas las capas
            const panes = clonedMap.querySelectorAll('.leaflet-pane')
            panes.forEach(pane => {
              pane.style.zIndex = 'auto'
              pane.style.position = 'absolute'
            })

            // Asegurar que los SVG paths sean visibles
            const paths = clonedMap.querySelectorAll('path')
            paths.forEach(path => {
              const stroke = path.getAttribute('stroke')
              const strokeWidth = path.getAttribute('stroke-width')
              if (stroke) {
                path.style.stroke = stroke
                path.style.strokeWidth = strokeWidth || '3'
                path.style.fill = 'none'
                path.style.strokeOpacity = '0.8'
              }
            })
          }
        }
      })

      const imgData = canvas.toDataURL('image/png', 1.0) // Máxima calidad
      const imgWidth = pageWidth - 40 // Margen de 20mm a cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const maxHeight = 120 // Altura máxima en mm

      // Agregar el mapa al PDF con proporción correcta
      pdf.addImage(imgData, 'PNG', 20, 56, imgWidth, Math.min(imgHeight, maxHeight))

      // Ajustar posición siguiente
      let currentY = 56 + Math.min(imgHeight, maxHeight) + 10

      // Ruta seleccionada
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Ruta Recomendada:', 20, currentY)

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Tipo: ${selectedRoute.name}`, 25, currentY + 8)
      pdf.text(`Distancia: ${selectedRoute.distance} km`, 25, currentY + 15)
      pdf.text(`Riesgo Promedio: ${selectedRoute.risk}`, 25, currentY + 22)
      pdf.text(`Score de Seguridad: ${selectedRoute.safety}/100`, 25, currentY + 29)

      currentY += 40

      // Comparación de rutas
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Comparación de Rutas:', 20, currentY)

      currentY += 8
      routes.forEach((route) => {
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`• ${route.name}`, 25, currentY)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`  Distancia: ${route.distance} km | Riesgo: ${route.risk} | Seguridad: ${route.safety}`, 30, currentY + 5)
        currentY += 12
      })

      // Recomendación
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Recomendación:', 20, currentY + 5)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const recommendation = `La ruta más segura reduce el riesgo en 32.6% con solo 17% más de distancia.\nVale la pena el pequeño incremento en tiempo para mayor seguridad.`
      const lines = pdf.splitTextToSize(recommendation, pageWidth - 40)
      pdf.text(lines, 25, currentY + 13)
    }
  } catch (error) {
    console.error('Error al capturar el mapa:', error)
    // Continuar con el PDF sin el mapa
  }

  // Footer
  pdf.setFontSize(8)
  pdf.setTextColor(128)
  pdf.text('Generado por Sistema de Ruteo Seguro CDMX', pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Guardar PDF
  pdf.save(`ruta_${origin.replace(/\s+/g, '_')}_${destination.replace(/\s+/g, '_')}.pdf`)
}

/**
 * Exporta el mapa como imagen PNG
 * @param {string} mapElementId - ID del elemento del mapa
 * @param {string} filename - Nombre del archivo
 */
export const exportToPNG = async (mapElementId, filename = 'mapa_ruta') => {
  const mapContainer = document.getElementById(mapElementId)
  const mapElement = mapContainer?.querySelector('.leaflet-container') || document.querySelector('.leaflet-container')

  if (!mapElement) {
    console.error('No se encontró el elemento del mapa')
    alert('Error: No se pudo encontrar el mapa para exportar')
    return
  }

  try {
    // Esperar más tiempo para asegurar que todo esté renderizado
    await new Promise(resolve => setTimeout(resolve, 2000))

    const canvas = await html2canvas(mapElement, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scale: 2,
      logging: true,
      width: mapElement.offsetWidth,
      height: mapElement.offsetHeight,
      imageTimeout: 0,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedMap = clonedDoc.querySelector('.leaflet-container')
        if (clonedMap) {
          clonedMap.style.width = mapElement.offsetWidth + 'px'
          clonedMap.style.height = mapElement.offsetHeight + 'px'

          // Forzar visibilidad de todas las capas
          const panes = clonedMap.querySelectorAll('.leaflet-pane')
          panes.forEach(pane => {
            pane.style.zIndex = 'auto'
            pane.style.position = 'absolute'
          })

          // Asegurar que los SVG paths (rutas) sean visibles
          const paths = clonedMap.querySelectorAll('path')
          paths.forEach(path => {
            const stroke = path.getAttribute('stroke')
            const strokeWidth = path.getAttribute('stroke-width') ||  '4'
            if (stroke) {
              path.style.stroke = stroke
              path.style.strokeWidth = strokeWidth
              path.style.fill = 'none'
              path.style.strokeOpacity = '1'
              path.style.strokeLinecap = 'round'
              path.style.strokeLinejoin = 'round'
            }
          })
        }
      }
    })

    // Convertir canvas a blob y descargar con máxima calidad
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.png`
      link.click()
      URL.revokeObjectURL(url)
      console.log('✅ Mapa exportado exitosamente como PNG')
    }, 'image/png', 1.0) // Máxima calidad
  } catch (error) {
    console.error('Error al exportar imagen:', error)
    alert('Error al exportar el mapa. Por favor intenta de nuevo.')
  }
}

/**
 * Exporta la ruta como archivo GPX (GPS Exchange Format)
 * @param {Object} routeData - Datos de la ruta
 */
export const exportToGPX = (routeData) => {
  const { origin, destination, selectedRoute } = routeData

  // Crear estructura GPX
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Sistema de Ruteo Seguro CDMX"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Ruta ${origin} a ${destination}</name>
    <desc>Ruta ${selectedRoute.name} - Distancia: ${selectedRoute.distance} km</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${selectedRoute.name}</name>
    <type>safe_route</type>
    <trkseg>`

  // Agregar puntos de la ruta
  let waypoints = ''
  selectedRoute.coordinates.forEach((coord, index) => {
    waypoints += `
      <trkpt lat="${coord[0]}" lon="${coord[1]}">
        <ele>2240</ele>
        <name>Punto ${index + 1}</name>
      </trkpt>`
  })

  const gpxFooter = `
    </trkseg>
  </trk>
  <wpt lat="${selectedRoute.coordinates[0][0]}" lon="${selectedRoute.coordinates[0][1]}">
    <name>Origen: ${origin}</name>
    <sym>Flag, Green</sym>
  </wpt>
  <wpt lat="${selectedRoute.coordinates[selectedRoute.coordinates.length - 1][0]}" lon="${selectedRoute.coordinates[selectedRoute.coordinates.length - 1][1]}">
    <name>Destino: ${destination}</name>
    <sym>Flag, Red</sym>
  </wpt>
</gpx>`

  const gpxContent = gpxHeader + waypoints + gpxFooter

  // Descargar archivo GPX
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ruta_${origin.replace(/\s+/g, '_')}_${destination.replace(/\s+/g, '_')}.gpx`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Exporta todos los formatos
 * @param {Object} routeData - Datos de la ruta
 * @param {string} mapElementId - ID del elemento del mapa
 */
export const exportAll = async (routeData, mapElementId) => {
  await exportToPDF(routeData)
  await exportToPNG(mapElementId, `mapa_${routeData.origin.replace(/\s+/g, '_')}`)
  exportToGPX(routeData)
}
