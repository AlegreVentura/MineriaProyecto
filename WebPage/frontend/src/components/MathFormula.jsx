import 'katex/dist/katex.min.css'
import { BlockMath, InlineMath } from 'react-katex'

/**
 * Componente reutilizable para renderizar fórmulas matemáticas con LaTeX
 * @param {string} math - La fórmula en notación LaTeX
 * @param {boolean} inline - Si es true, renderiza inline; si es false, renderiza como bloque
 * @param {string} className - Clases CSS adicionales
 */
const MathFormula = ({ math, inline = false, className = '' }) => {
  return (
    <div className={className}>
      {inline ? (
        <InlineMath math={math} />
      ) : (
        <BlockMath math={math} />
      )}
    </div>
  )
}

export default MathFormula
