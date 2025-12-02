const KPICard = ({ value, label, subtitle, delta, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-orange-500 to-orange-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-center">
        <div className={`inline-block bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg p-3 mb-4`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>

        {delta && (
          <div className={`text-sm font-semibold mb-2 ${delta < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {delta < 0 ? '↓' : '↑'} {Math.abs(delta)}
          </div>
        )}

        <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>

        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
  )
}

export default KPICard
