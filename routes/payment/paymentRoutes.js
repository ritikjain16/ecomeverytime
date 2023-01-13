import express from "express";
import {
  createOrder,
  paymentCallback,
  // getLogo,
  getPayment,
} from "./paymentController.js";

const router = express.Router();

router.post("/createorder", createOrder);
router.post("/payment/callback", paymentCallback);
router.get("/payments/:paymentID", getPayment);
// router.get("/logo", getLogo);

export default router;
