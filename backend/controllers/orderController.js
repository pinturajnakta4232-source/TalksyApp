import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 49;

// @desc Place a Cash on Delivery order from the user's cart
// @route POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (paymentMethod && paymentMethod !== "COD") {
      // Real UPI payment isn't wired up yet - see README for how to add
      // Razorpay/Cashfree here. For now only COD orders can be created.
      return res.status(400).json({
        message: "Online UPI payment isn't enabled yet. Please select Cash on Delivery.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `"${product?.name || "Item"}" doesn't have enough stock`,
        });
      }
      const price = Math.round(product.price - (product.price * product.discount) / 100);
      itemsPrice += price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
      });
    }

    const deliveryCharge = itemsPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const totalAmount = itemsPrice + deliveryCharge;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "pending",
      itemsPrice,
      deliveryCharge,
      totalAmount,
      orderStatus: "placed",
    });

    // Decrement stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get logged in user's orders
// @route GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single order (owner or admin)
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email mobile");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all orders (admin)
// @route GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email mobile").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update order status (admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
