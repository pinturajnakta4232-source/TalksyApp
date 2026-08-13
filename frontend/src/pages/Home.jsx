import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get("/products?limit=8").then(({ data }) => setProducts(data.products));
  }, []);

  const handleAdd = async (id) => {
    if (!user) return (window.location.href = "/login");
    await addToCart(id);
  };

  return (
    <div>
      <section className="hero">
        <h1>
          Shop More, <span>Pay Less</span>
        </h1>
        <p>Everything you need, at prices that make sense.</p>
        <Link to="/products" className="btn">
          Browse Products
        </Link>
      </section>

      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAddToCart={handleAdd} />
          ))}
        </div>
      </div>
    </div>
  );
}
