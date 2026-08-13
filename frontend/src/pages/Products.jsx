import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    api.get("/products/categories/all").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    api.get(`/products?${params.toString()}`).then(({ data }) => setProducts(data.products));
  }, [search, category, sort]);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const handleAdd = async (id) => {
    if (!user) return (window.location.href = "/login");
    await addToCart(id);
  };

  return (
    <div className="container">
      <h2 className="section-title">All Products</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          placeholder="Search products..."
          defaultValue={search}
          onKeyDown={(e) => e.key === "Enter" && update("search", e.target.value)}
          onBlur={(e) => update("search", e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd", flex: 1, minWidth: 200 }}
        />
        <select value={category} onChange={(e) => update("category", e.target.value)} style={{ padding: 10, borderRadius: 6 }}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => update("sort", e.target.value)} style={{ padding: 10, borderRadius: 6 }}>
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAddToCart={handleAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
