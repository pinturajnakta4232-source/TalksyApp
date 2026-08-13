import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_THRESHOLD = 999;

export default function Checkout() {
  const { cart, clearCartLocal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
    state: user?.state || "",
    district: user?.district || "",
    pincode: user?.pincode || "",
  });

  const items = cart.items || [];
  const itemsPrice = items.reduce((sum, item) => {
    const price = Math.round(item.product.price - (item.product.price * item.product.discount) / 100);
    return sum + price * item.quantity;
  }, 0);
  const deliveryCharge = itemsPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = itemsPrice + deliveryCharge;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: form,
        paymentMethod: "COD",
      });
      clearCartLocal();
      navigate(`/orders`, { state: { placedOrderId: data._id } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="container" style={{ padding: 40 }}>Your cart is empty.</div>;
  }

  return (
    <div className="container" style={{ padding: "30px 20px", display: "flex", gap: 30, flexWrap: "wrap" }}>
      <div style={{ flex: 2, minWidth: 300 }}>
        <h2 className="section-title">Shipping Address</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>District</label>
            <input name="district" value={form.district} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>PIN Code</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} required />
          </div>
        </div>

        <h2 className="section-title">Payment Method</h2>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <label className="summary-box" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="radio" name="payment" checked readOnly />
            Cash on Delivery (COD)
          </label>
          <label className="summary-box" style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.5 }}>
            <input type="radio" disabled />
            UPI Payment <span className="badge-payment">Coming soon</span>
          </label>
        </div>
        <p style={{ fontSize: 13, color: "#888" }}>
          UPI payment (Google Pay / PhonePe / Paytm) requires a payment gateway account and isn't
          wired up in this build yet — see the README for how to add it.
        </p>
      </div>

      <div style={{ flex: 1, minWidth: 260 }}>
        <div className="summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({items.length})</span>
            <span>₹{itemsPrice}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-block" style={{ marginTop: 14 }} onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Placing order..." : "Place Order (COD)"}
          </button>
        </div>
      </div>
    </div>
  );
}
