import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  order: Array,
});

const OrderList = mongoose.model("order", orderSchema);

export default OrderList;
