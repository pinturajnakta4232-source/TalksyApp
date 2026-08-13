import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, fetchCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart.items || [];

  const total = items.reduce((sum, item) => {
    const price = Math.round(item.product.price - (item.product.price * item.product.discount) / 100);
    return sum + price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "30px 20px" }}>
      <h2 className="section-title">Your Cart</h2>
      {items.map((item) => {
        const price = Math.round(item.product.price - (item.product.price * item.product.discount) / 100);
        return (
          <div className="cart-row" key={item.product._id}>
            <div>
              <strong>{item.product.name}</strong>
              <p>₹{price} each</p>
            </div>
            <div className="qty-control">
              <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
            </div>
            <div>₹{price * item.quantity}</div>
            <button className="btn btn-outline" onClick={() => removeFromCart(item.product._id)}>
              Remove
            </button>
          </div>
        );
      })}

      <div className="summary-box" style={{ maxWidth: 340, marginLeft: "auto", marginTop: 20 }}>
        <div className="summary-row summary-total">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
