import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCopy, FaCheck, FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'

/**
 * Modal para compartir rutas con QR code y URL
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {object} routeData - Datos de la ruta a compartir
 */
const ShareModal = ({ isOpen, onClose, routeData }) => {
  const [copied, setCopied] = useState(false)

  // Generar URL compartible
  const generateShareUrl = () => {
    const params = new URLSearchParams({
      origin: routeData.origin,
      destination: routeData.destination,
      type: routeData.routeType,
      autoCalculate: 'true', // Auto-calcular ruta al escanear QR
    })

    // Obtener la URL base sin query params
    const baseUrl = window.location.origin + window.location.pathname
    const fullUrl = `${baseUrl}?${params.toString()}`

    // Si estamos en localhost, mostrar advertencia en consola
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('🔗 Compartiendo desde localhost. Para compartir desde el celular, usa la IP de tu red (ej: http://192.168.1.x:3002)')
    }

    return fullUrl
  }

  const shareUrl = generateShareUrl()

  // Copiar al portapapeles
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  // Compartir en redes sociales
  const shareToWhatsApp = () => {
    const text = `Mira esta ruta segura en CDMX: De ${routeData.origin} a ${routeData.destination}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`, '_blank')
  }

  const shareToTwitter = () => {
    const text = `Ruta segura CDMX: ${routeData.origin} → ${routeData.destination}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Compartir Ruta</h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                <p className="text-primary-100 text-sm mt-2">
                  Comparte esta ruta segura con tus amigos
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Route Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Ruta</div>
                  <div className="font-semibold text-gray-900">
                    {routeData.origin} → {routeData.destination}
                  </div>
                  <div className="mt-2 inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {routeData.routeTypeName || 'Ruta Segura'}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-100">
                    <QRCodeSVG
                      value={shareUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                      fgColor="#1e40af"
                    />
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Escanea el código QR para abrir la ruta
                </div>

                {/* URL Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Enlace compartible
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <FaCheck /> Copiado
                        </>
                      ) : (
                        <>
                          <FaCopy /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                  {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      ⚠️ Estás en localhost. Para compartir desde celular, accede desde la IP de tu red (ej: 192.168.1.x:3002)
                    </div>
                  )}
                </div>

                {/* Social Share Buttons */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Compartir en redes sociales
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={shareToWhatsApp}
                      className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                    >
                      <FaWhatsapp className="text-3xl text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                    </button>
                    <button
                      onClick={shareToTwitter}
                      className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                    >
                      <FaTwitter className="text-3xl text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-gray-700">Twitter</span>
                    </button>
                    <button
                      onClick={shareToFacebook}
                      className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                    >
                      <FaFacebook className="text-3xl text-blue-700 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-gray-700">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ShareModal
