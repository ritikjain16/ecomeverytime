import express from "express";
import UserList from "../schemas/UserSchema.js";
import OrderList from "../schemas/OrderSchema.js";
import { sendMailToUser } from "./sendMail.js";
import { mymiddleware } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/status/packedDate", mymiddleware, async (req, res) => {
  const { uid, oid, packedDate } = req.body;
  try {
    const changeUserOrderpackedDate = await UserList.updateOne(
      {
        uid,
        "orders.singleorder.oid": oid,
      },
      {
        $set: {
          "orders.$.singleorder.packedDate": packedDate,
          "orders.$.singleorder.status": "Packed",
        },
      }
    );

    try {
      const changeAdminOrderStatus = await OrderList.updateOne(
        {
          "order.uid": uid,
          "order.oid": oid,
        },
        {
          $set: {
            "order.$.packedDate": packedDate,
            "order.$.status": "Packed",
          },
        }
      );
      sendMailToUser(
        req.body.email,
        "Order Packed",
        `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been packed on ${packedDate}.</p>`
      );
      res.status(200).send({ msg: "Packed on " + packedDate });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/status/shippedDate", mymiddleware, async (req, res) => {
  const { uid, oid, shippedDate } = req.body;
  try {
    const changeUserOrdershippedDate = await UserList.updateOne(
      {
        uid,
        "orders.singleorder.oid": oid,
      },
      {
        $set: {
          "orders.$.singleorder.shippedDate": shippedDate,
          "orders.$.singleorder.status": "Shipped",
        },
      }
    );

    try {
      const changeAdminOrderStatus = await OrderList.updateOne(
        {
          "order.uid": uid,
          "order.oid": oid,
        },
        {
          $set: {
            "order.$.shippedDate": shippedDate,
            "order.$.status": "Shipped",
          },
        }
      );
      sendMailToUser(
        req.body.email,
        "Order Shipped",
        `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been shipped on ${shippedDate}.</p>`
      );
      res.status(200).send({ msg: "Shipped on " + shippedDate });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/status/deliveredDate", mymiddleware, async (req, res) => {
  const { uid, oid, deliveredDate } = req.body;
  try {
    const changeUserOrderdeliveredDate = await UserList.updateOne(
      {
        uid,
        "orders.singleorder.oid": oid,
      },
      {
        $set: {
          "orders.$.singleorder.deliveredDate": deliveredDate,
          "orders.$.singleorder.status": "Delivered",
        },
      }
    );

    try {
      const changeAdminOrderStatus = await OrderList.updateOne(
        {
          "order.uid": uid,
          "order.oid": oid,
        },
        {
          $set: {
            "order.$.deliveredDate": deliveredDate,
            "order.$.status": "Delivered",
          },
        }
      );
      sendMailToUser(
        req.body.email,
        "Order Delivered",
        `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been delivered on ${deliveredDate}.</p>`
      );
      res.status(200).send({ msg: "Delivered on " + deliveredDate });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/status/returnDate", mymiddleware, async (req, res) => {
  const { uid, oid, returnDate } = req.body;
  try {
    const changeUserOrderreturnDate = await UserList.updateOne(
      {
        uid,
        "orders.singleorder.oid": oid,
      },
      {
        $set: {
          "orders.$.singleorder.returnDate": returnDate,
          "orders.$.singleorder.status": "Returned",
        },
      }
    );

    try {
      const changeAdminOrderStatus = await OrderList.updateOne(
        {
          "order.uid": uid,
          "order.oid": oid,
        },
        {
          $set: {
            "order.$.returnDate": returnDate,
            "order.$.status": "Returned",
          },
        }
      );
      sendMailToUser(
        req.body.email,
        "Order Returned",
        `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been returned on ${returnDate}.</p>`
      );
      res.status(200).send({ msg: "Returned on " + returnDate });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/status/cancelledDate", mymiddleware, async (req, res) => {
  const { uid, oid, cancelledDate } = req.body;
  try {
    const changeUserOrdercancelledDate = await UserList.updateOne(
      {
        uid,
        "orders.singleorder.oid": oid,
      },
      {
        $set: {
          "orders.$.singleorder.cancelledDate": cancelledDate,
          "orders.$.singleorder.status": "Cancelled",
        },
      }
    );

    try {
      const changeAdminOrderStatus = await OrderList.updateOne(
        {
          "order.uid": uid,
          "order.oid": oid,
        },
        {
          $set: {
            "order.$.cancelledDate": cancelledDate,
            "order.$.status": "Cancelled",
          },
        }
      );
      sendMailToUser(
        req.body.email,
        "Order Cancelled",
        `<div>Hi ${req.body.email},</div><p>Order with order id <b>${req.body.oid}</b> has been cancelled on ${cancelledDate}.</p>`
      );
      res.status(200).send({ msg: "Cancelled on " + cancelledDate });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

export default router;
