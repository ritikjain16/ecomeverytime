import express from "express";
import UserList from "../schemas/UserSchema.js";
import OrderList from "../schemas/OrderSchema.js";
import { sendMailToUser } from "./sendMail.js";
import ProductList from "../schemas/ProductSchema.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { mymiddleware } from "../middleware/authmiddleware.js";
dotenv.config();
const router = express.Router();

const keyid = process.env.KEY_ID;
const keysecret = process.env.KEY_SECRET;

var instance = new Razorpay({
  key_id: keyid,
  key_secret: keysecret,
});

router.post("/signin", mymiddleware, async (req, res) => {
  const { uid } = req.body;
  try {
    const finduser = await UserList.findOne({ uid });
    if (finduser) {
      sendMailToUser(
        req.body.email,
        "Welcome back " + req.body.name,
        `<div>Hi ${req.body.name},</div><p>Welcome back ${req.body.email}. Login Success!!!</p>`
      );
      res.status(200).send({ mess: "User Already Exits" });
    } else {
      try {
        await UserList.create(req.body);
        sendMailToUser(
          req.body.email,
          "Welcome to mywebsite " + req.body.name,
          `<div>Hi ${req.body.name},</div><p>Welcome to mywebsite ${req.body.email}. Login Success!!!</p>`
        );
        res.status(200).send({ mess: "New User Signin Success" });
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/get", mymiddleware, async (req, res) => {
  const { uid } = req.body;
  try {
    const finduser = await UserList.findOne({ uid });
    res.status(200).send(finduser);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/cart/add", mymiddleware, async (req, res) => {
  const { uid, cid, pid } = req.body;
  try {
    const user = await UserList.findOne({ uid });
    const isProductAlreadyExist = user.cart.find((p) => p.pid === pid);

    if (isProductAlreadyExist) {
      await UserList.updateOne(
        { uid, "cart.pid": pid },
        {
          $inc: {
            "cart.$.qty": 1,
          },
        }
      );
      res.status(200).send({ msg: "1 more Added To Cart" });
    } else {
      await UserList.updateOne(
        { uid },
        { $push: { cart: { pid, cid, isReviewed: false, qty: 1 } } }
      );
      res.status(200).send({ msg: "Added To Cart" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/cart/delete", mymiddleware, async (req, res) => {
  const { uid, cid, pid } = req.body;
  try {
    const user = await UserList.findOne({ uid });
    const product = user.cart.find((p) => p.pid === pid);
    if (product.qty === 1) {
      await UserList.updateOne({ uid }, { $pull: { cart: { pid, cid } } });
      res.status(200).send({ msg: "Deleted from Cart" });
    } else {
      await UserList.updateOne(
        { uid, "cart.pid": pid },
        {
          $inc: {
            "cart.$.qty": -1,
          },
        }
      );
      res.status(200).send({ msg: "1 more Reduced from Cart" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/address/add", mymiddleware, async (req, res) => {
  const { uid, address, aid } = req.body;
  try {
    const addaddress = await UserList.updateOne(
      { uid },
      { $push: { addresses: { address, aid } } }
    );
    res.status(200).send({ msg: "Address Added" });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/address/update", mymiddleware, async (req, res) => {
  const { uid, address, aid } = req.body;
  try {
    const updateaddress = await UserList.updateOne(
      { uid, "addresses.address.aid": aid },
      {
        $set: {
          "addresses.$.address.aid": aid,
          "addresses.$.address.aname": address.aname,
          "addresses.$.address.ahouseno": address.ahouseno,
          "addresses.$.address.alocality": address.alocality,
          "addresses.$.address.apincode": address.apincode,
          "addresses.$.address.astate": address.astate,
          "addresses.$.address.acity": address.acity,
          "addresses.$.address.amobile": address.amobile,
        },
      }
    );
    res.status(200).send({ msg: "Address Updated" });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/address/delete", mymiddleware, async (req, res) => {
  const { uid, aid } = req.body;
  try {
    const deleteaddress = await UserList.updateOne(
      { uid },
      { $pull: { addresses: { aid } } }
    );
    res.status(200).send({ msg: "Address Removed" });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/placeorder", mymiddleware, async (req, res) => {
  const { uid } = req.body;
  try {
    const addinmyorders = await OrderList.create({ order: req.body });
    try {
      const addorder = await UserList.updateOne(
        { uid },
        {
          $push: {
            orders: {
              singleorder: req.body,
              oid: req.body.oid,
            },
          },
          $set: { cart: [] },
        }
      );
      sendMailToUser(
        req.body.email,
        "Order Placed",
        `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been successfully placed. Please pay cash on delivey.</p>`
      );
      res.status(200).send({ msg: "Order Placed" });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/review/add", mymiddleware, async (req, res) => {
  const { pid, cid, oid, reviewData, uid } = req.body;
  try {
    await ProductList.updateOne(
      { _id: pid },
      { $push: { reviews: reviewData } }
    );

    try {
      const addreviewinuser = await UserList.updateOne(
        {
          uid,
        },
        {
          $set: {
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].cid": cid,
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].pid": pid,
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].isReviewed": true,
          },
        },
        {
          arrayFilters: [{ "o.oid": oid }, { "c.cid": cid, "c.pid": pid }],
        }
      );
      res.status(200).send({
        msg: `Review added by user!!! for ${pid}`,
      });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// ----------Online Payment----------------

router.post("/create/order", mymiddleware, async (req, res) => {
  const { amt } = req.body;
  var oid = "OD_" + Math.floor(Math.random() * 99999999);
  var options = {
    amount: amt, // amount in the smallest currency unit
    currency: "INR",
    receipt: oid,
  };
  instance.orders.create(options, function (err, order) {
    res.status(200).send({ order, keyid });
  });
});

router.post("/placeorder/online", mymiddleware, async (req, res) => {
  const { uid } = req.body;
  console.log(req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.details;
  try {
    const hash = crypto
      .createHmac("sha256", keysecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (hash === razorpay_signature) {
      try {
        const addinmyorders = await OrderList.create({ order: req.body });
        try {
          const addorder = await UserList.updateOne(
            { uid },
            {
              $push: {
                orders: {
                  singleorder: req.body,
                  oid: req.body.oid,
                },
              },
              $set: { cart: [] },
            }
          );
          sendMailToUser(
            req.body.email,
            "Order Placed",
            `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been successfully placed. Thanks for using Razorpay.</p>`
          );
          res.status(200).send({ msg: "Order Placed" });
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }

        // res.status(200).send({ msg: "Payment Success" });
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
    } else {
      res.status(200).send({ msg: "Payment Failed" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

export default router;
