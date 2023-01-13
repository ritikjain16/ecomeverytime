import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  productDetails: Object,
  reviews:Array
});

export default mongoose.model("product", productSchema);
