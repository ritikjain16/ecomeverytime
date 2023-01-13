import dotenv from "dotenv";
import Razorpay from "razorpay";
import formidable from "formidable";
import OrderList from "../../schemas/OrderSchema.js";
import UserList from "../../schemas/UserSchema.js";
import request from "request";
import crypto from "crypto";
import { sendMailToUser } from "../sendMail.js";
dotenv.config();

let orderId;
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
  //   headers: { "X-Razorpay-Account": "" },
});

let oid1, uid;
let mydata;

export const createOrder = (req, res) => {
  const { amount1, oid } = req.body;
  oid1 = oid;
  mydata = req.body;
  uid = req.body.uid;
  var options = {
    amount: amount1, // amount in the smallest currency unit
    currency: "INR",
    receipt: oid,
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    orderId = order.id;
    res.json(order);
  });
};

export const paymentCallback = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (fields) {
      {
        // const hash = crypto
        //   .createHmac("sha256", process.env.KEY_SECRET)
        //   .update(orderId + "|" + fields.razorpay_payment_id)
        //   .digest("hex");

        // // console.log("hash--->", hash);
        // // console.log(fields.razorpay_signature);

        // if (fields.razorpay_signature === hash) {
        //   //store in db
        //   const info = {
        //     _id: fields.razorpay_payment_id,
        //     orders: fields,
        //   };

        mydata["oid1"] = fields.razorpay_payment_id;
        mydata["orderID"] = fields.razorpay_order_id;
        mydata["razorpay_payment_id"] = fields.razorpay_payment_id;
        mydata["razorpay_order_id"] = fields.razorpay_order_id;
        mydata["razorpay_signature"] = fields.razorpay_signature;
        mydata["payment_method"] = "Online";

        try {
          const addinmyorders = await OrderList.create({ order: mydata });
          try {
            const addorder = await UserList.updateOne(
              { uid },
              {
                $push: {
                  orders: {
                    singleorder: mydata,
                    oid: mydata.oid,
                  },
                },
                $set: { cart: [] },
              }
            );
            sendMailToUser(
              mydata.email,
              "Order Placed",
              `<div>Hi ${mydata.email},</div><p>Order with order id <b>${mydata.oid}</b> has been successfully placed. Order is paid already.</p>`
            );
            res.redirect(`${process.env.FRONTEND}`);
          } catch (e) {
            console.log(e);
            res.status(400).send(e);
          }
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }
        // } else {
        //   res.status(200).send({ msg: "Payment Not verified" });
        // }
      }
    }
  });
};

export const getPayment = async (req, res) => {
  try {
    request(
      `https://${process.env.KEY_ID}:${process.env.KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentID}`,
      function (error, response, body) {
        if (body) {
          const result = JSON.parse(body);
          res.status(200).json(result);
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};
