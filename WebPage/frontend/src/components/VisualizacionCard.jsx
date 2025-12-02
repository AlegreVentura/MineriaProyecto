import { FaExternalLinkAlt, FaChartBar } from 'react-icons/fa'

const VisualizacionCard = ({ title, description, src, preview }) => {
  const handleOpenVisualization = () => {
    window.open(src, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300">
      {/* Preview Image or Icon */}
      <div className="bg-gradient-to-br from-primary-100 to-accent-100 p-12 flex items-center justify-center">
        <FaChartBar className="text-6xl text-primary-600 opacity-50" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <button
          onClick={handleOpenVisualization}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <span>Ver Visualización</span>
          <FaExternalLinkAlt className="text-sm" />
        </button>
      </div>
    </div>
  )
}

export default VisualizacionCard
