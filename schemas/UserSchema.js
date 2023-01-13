import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  image: String,
  uid: String,
  orders: [
    {
      singleorder: Object,
      oid: String,
    },
  ],
  wishlist: Array,
  addresses: Array,
  cart: Array,
});

export default mongoose.model("user", userSchema);
