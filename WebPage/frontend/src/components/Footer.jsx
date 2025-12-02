import { FaGithub, FaLinkedin, FaEnvelope, FaCar, FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Proyecto',
      links: [
        { name: 'Sobre el Proyecto', href: '#about' },
        { name: 'Metodología', href: '#methodology' },
        { name: 'Resultados', href: '#results' },
        { name: 'Conclusiones', href: '#conclusions' },
      ]
    },
    {
      title: 'Recursos',
      links: [
        { name: 'Demo Interactiva', href: '#demo' },
        { name: 'Documentación', href: '#' },
        { name: 'Notebooks', href: '#' },
        { name: 'GitHub', href: '#' },
      ]
    },
    {
      title: 'Contacto',
      links: [
        { name: 'Email', href: 'mailto:contacto@example.com' },
        { name: 'LinkedIn', href: '#' },
        { name: 'GitHub', href: '#' },
      ]
    }
  ]

  const dataSources = [
    { name: 'C5 CDMX', url: 'https://datos.cdmx.gob.mx/' },
    { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <FaCar className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">Ruteo Seguro CDMX</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Sistema integral de análisis de accidentes de tránsito para mejorar la seguridad vial en la Ciudad de México.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaGithub className="text-lg" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="mailto:contacto@example.com" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaEnvelope className="text-lg" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Data Sources */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="text-white font-bold mb-4">Fuentes de Datos</h4>
          <div className="flex flex-wrap gap-4">
            {dataSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                {source.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} Sistema de Ruteo Seguro CDMX. Proyecto Final de Minería de Datos.
            </div>
            <div className="flex items-center text-sm text-gray-500">
              Hecho con <FaHeart className="text-red-500 mx-1" /> para mejorar la seguridad vial
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
