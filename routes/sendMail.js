import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendMailToUser = (tomail, subject, html) => {
  const mymail = process.env.EMAIL;
  const pass = process.env.PASS;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mymail,
      pass,
    },
  });

  var mailOptions = {
    from: mymail,
    to: tomail,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
