import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, default: "Pinzo" },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // percentage
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual("finalPrice").get(function () {
  return Math.round(this.price - (this.price * this.discount) / 100);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
