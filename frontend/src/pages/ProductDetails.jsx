import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className="container">Loading...</div>;

  const finalPrice = Math.round(product.price - (product.price * product.discount) / 100);

  const handleAdd = async () => {
    if (!user) return (window.location.href = "/login");
    await addToCart(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container" style={{ display: "flex", gap: 40, flexWrap: "wrap", padding: "30px 20px" }}>
      <div className="card-img" style={{ width: 320, height: 320 }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          "No image available"
        )}
      </div>
      <div style={{ flex: 1, minWidth: 280 }}>
        <h1>{product.name}</h1>
        <p style={{ color: "#666" }}>{product.brand} · {product.category}</p>
        <p>{product.description}</p>
        <div style={{ margin: "14px 0" }}>
          <span className="price" style={{ fontSize: 24 }}>₹{finalPrice}</span>
          {product.discount > 0 && (
            <>
              <span className="price-old">₹{product.price}</span>
              <span className="discount-tag">{product.discount}% off</span>
            </>
          )}
        </div>
        <p>{product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}</p>
        <div className="qty-control" style={{ margin: "14px 0" }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>
        <button className="btn" onClick={handleAdd} disabled={product.stock === 0}>
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
