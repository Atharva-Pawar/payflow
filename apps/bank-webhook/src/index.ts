import express from "express";
import db from "@repo/db/client";

const app = express();

app.post("/hdfcWebhook", async (req, res) => {
  //TODO: Add zod validation here?
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  await db.orm.public.Balance.where({
    userId: paymentInformation.userId,
  }).update({
    amount: paymentInformation.amount,
  });

  await db.orm.public.OnRampTransaction.where({
    token: paymentInformation.token,
  }).update({
    status: "Success",
  });

  res.status(200).json({
    message: "captured",
  });
});
