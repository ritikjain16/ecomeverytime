import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { mymiddleware } from "./middleware/authmiddleware.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
//my ecom app
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((e) => {
    console.log("Errror ========> " + e);
  });

app.use("/auth", userRouter);
app.use("/product", productRouter);
app.use("/admin", adminRouter);

app.post("/getkey", mymiddleware, (req, res) => {
  res.status(200).send(process.env.KEY_ID);
});
// f
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
