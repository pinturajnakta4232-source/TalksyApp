import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const finalPrice = Math.round(product.price - (product.price * product.discount) / 100);

  return (
    <div className="card">
      <Link to={`/products/${product._id}`}>
        <div className="card-img">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "No image"
          )}
        </div>
      </Link>
      <div className="card-body">
        <Link to={`/products/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div>
          <span className="price">₹{finalPrice}</span>
          {product.discount > 0 && (
            <>
              <span className="price-old">₹{product.price}</span>
              <span className="discount-tag">{product.discount}% off</span>
            </>
          )}
        </div>
        <button className="btn btn-block" style={{ marginTop: 10 }} onClick={() => onAddToCart(product._id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
