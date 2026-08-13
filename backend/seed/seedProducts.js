import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Pinzo Wireless Earbuds",
    description: "Bluetooth 5.3 earbuds with 30-hour battery life and active noise cancellation.",
    brand: "Pinzo",
    price: 1999,
    discount: 25,
    category: "Electronics",
    images: [],
    stock: 50,
    rating: 4.3,
    numReviews: 12,
  },
  {
    name: "Pinzo Smart Watch",
    description: "AMOLED display smartwatch with heart-rate and SpO2 tracking.",
    brand: "Pinzo",
    price: 3499,
    discount: 15,
    category: "Electronics",
    images: [],
    stock: 30,
    rating: 4.1,
    numReviews: 8,
  },
  {
    name: "Cotton Casual Shirt",
    description: "Breathable 100% cotton shirt, regular fit, machine washable.",
    brand: "Pinzo Fashion",
    price: 899,
    discount: 10,
    category: "Fashion",
    images: [],
    stock: 100,
    rating: 4.0,
    numReviews: 20,
  },
  {
    name: "Stainless Steel Water Bottle 1L",
    description: "Vacuum insulated, keeps drinks cold for 24 hours / hot for 12 hours.",
    brand: "Pinzo Home",
    price: 599,
    discount: 5,
    category: "Home & Kitchen",
    images: [],
    stock: 80,
    rating: 4.6,
    numReviews: 35,
  },
];

const run = async () => {
  await connectDB();

  await Product.deleteMany();
  await Product.insertMany(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} products`);

  const adminExists = await User.findOne({ email: "admin@pinzo.com" });
  if (!adminExists) {
    await User.create({
      name: "Pinzo Admin",
      email: "admin@pinzo.com",
      mobile: "9999999999",
      password: "admin123",
      role: "admin",
    });
    console.log("Created admin user -> email: admin@pinzo.com / password: admin123");
  }

  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
