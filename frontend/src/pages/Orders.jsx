import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => setOrders(data));
  }, []);

  if (orders.length === 0) {
    return <div className="container" style={{ padding: 40 }}>You haven't placed any orders yet.</div>;
  }

  return (
    <div className="container" style={{ padding: "30px 20px" }}>
      <h2 className="section-title">My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div>
              <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
              <p style={{ margin: "4px 0", color: "#888", fontSize: 13 }}>
                {new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod}
              </p>
            </div>
            <span className="status-pill">{order.orderStatus}</span>
          </div>
          <ul>
            {order.items.map((item) => (
              <li key={item.product}>
                {item.name} × {item.quantity} — ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: ₹{order.totalAmount}</strong> (Delivery: ₹{order.deliveryCharge})
          </p>
          <p style={{ fontSize: 13, color: "#666" }}>
            Deliver to: {order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>
      ))}
    </div>
  );
}
