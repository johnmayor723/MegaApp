const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SK}` }
    });

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      // Payment completed ✅
      // Here you can save to DB, mark user's plan as paid, etc.
      return res.render("payment-success", { reference, email: data.data.customer.email });
    } else {
      return res.render("payment-failed", { reference });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment verification failed");
  }
});

module.exports = router;
