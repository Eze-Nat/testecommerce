import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';

const PerfumeCard = ({ perfume }) => {
  const { addToCart } = useCart();

  return (
    <article className="perfume-card" aria-labelledby={`perfume-${perfume.id}-title`}>
      <header>
        <h3 id={`perfume-${perfume.id}-title`}>{perfume.nombre}</h3>
        <span className="price">${perfume.precio.toFixed(2)}</span>
      </header>
      <div className="perfume-image-container">
        <img 
          src={perfume.imagen_url} 
          alt="" 
          loading="lazy"
          width="300"
          height="300"
        />
      </div>
      <button 
        onClick={() => addToCart(perfume)}
        aria-label={`Agregar ${perfume.nombre} al carrito`}
      >
        <FiShoppingCart /> Agregar
      </button>
    </article>
  );
};

PerfumeCard.propTypes = {
  perfume: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    imagen_url: PropTypes.string
  }).isRequired
};

export default PerfumeCard;