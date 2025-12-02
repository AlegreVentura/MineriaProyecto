import { useState } from 'react'

const IframeVisualizacion = ({ src, title, height = '600px', className = '' }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={`w-full ${className}`}>
      {isLoading && (
        <div
          className="flex items-center justify-center bg-gray-100 rounded-lg"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando visualización...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div
          className="flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
          style={{ height }}
        >
          <div className="text-center text-red-600">
            <p className="font-semibold mb-2">Error al cargar la visualización</p>
            <p className="text-sm">Por favor, intenta recargar la página</p>
          </div>
        </div>
      )}

      <iframe
        src={src}
        title={title}
        width="100%"
        height={height}
        frameBorder="0"
        className={`rounded-lg shadow-xl ${isLoading || hasError ? 'hidden' : 'block'}`}
        sandbox="allow-scripts allow-same-origin"
        onLoad={handleLoad}
        onError={handleError}
        style={{ border: 'none' }}
      />
    </div>
  )
}

export default IframeVisualizacion
