import express from "express";
import ProductList from "../schemas/ProductSchema.js";
import { mymiddleware } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/add", mymiddleware, async (req, res) => {
  try {
    await ProductList.create(req.body);
    res.status(200).send({ msg: "Product Added" });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/get", mymiddleware, async (req, res) => {
  try {
    const getProducts = await ProductList.find();
    res.status(200).send(getProducts);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

export default router;
