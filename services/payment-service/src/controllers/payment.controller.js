import crypto from "crypto";
import {
  createPaymentService,
  getPaymentByIdService,
  getPaymentByAppointmentIdService,
  markPaymentSuccessService,
  markPaymentFailedService
} from "../services/payment.service.js";

export const createPaymentController = async (req, res) => {
  try {
    const payment = await createPaymentService(req.body);
    res.status(201).json({
      message: "Payment created successfully",
      payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentByIdController = async (req, res) => {
  try {
    const payment = await getPaymentByIdService(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPaymentByAppointmentIdController = async (req, res) => {
  try {
    const payment = await getPaymentByAppointmentIdService(req.params.appointmentId);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const markPaymentSuccessController = async (req, res) => {
  try {
    const payment = await markPaymentSuccessService(req.params.id);
    res.status(200).json({
      message: "Payment marked as successful",
      payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markPaymentFailedController = async (req, res) => {
  try {
    const payment = await markPaymentFailedService(req.params.id);
    res.status(200).json({
      message: "Payment marked as failed",
      payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Called by frontend to get all form fields + hash needed for PayHere checkout
// Hash must be generated server-side so merchant secret is never exposed to browser
export const getPayhereParamsController = async (req, res) => {
  try {
    const payment = await getPaymentByIdService(req.params.paymentId);

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const notifyUrl = process.env.PAYHERE_NOTIFY_URL;
    const returnUrl = process.env.PAYHERE_RETURN_URL || "http://localhost:3000/payment/success";
    const cancelUrl = process.env.PAYHERE_CANCEL_URL || "http://localhost:3000/payment/cancel";

    if (!merchantId || !merchantSecret || !notifyUrl) {
      return res.status(500).json({ message: "PayHere credentials not configured" });
    }

    // PayHere hash formula:
    // MD5( merchant_id + order_id + amount(2dp) + currency + MD5(merchant_secret).toUpperCase() ).toUpperCase()
    const amountFormatted = parseFloat(payment.amount).toFixed(2);
    const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
    const hash = crypto
      .createHash("md5")
      .update(merchantId + payment.id + amountFormatted + payment.currency + hashedSecret)
      .digest("hex")
      .toUpperCase();

    res.status(200).json({
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: payment.id,
      items: "Doctor Consultation",
      amount: amountFormatted,
      currency: payment.currency,
      hash,
      // Test customer details for sandbox
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      phone: "0771234567",
      address: "No 1, Main Street",
      city: "Colombo",
      country: "Sri Lanka"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Called by PayHere after payment is completed (success or failure)
// PayHere sends this as form data (x-www-form-urlencoded), not JSON
export const payhereNotifyController = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;

    // Verify PayHere MD5 signature to ensure the request is genuine
    // Formula: MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret).toUpperCase()).toUpperCase()
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (merchantSecret) {
      const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
      const expectedSig = crypto
        .createHash("md5")
        .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
        .digest("hex")
        .toUpperCase();

      if (md5sig !== expectedSig) {
        console.error("PayHere notify: invalid md5sig — possible spoofing attempt");
        return res.status(400).send("Invalid signature");
      }
    }

    // status_code 2 = SUCCESS, 0 = PENDING, -1 = CANCELLED, -2 = CHARGEBACK
    if (status_code === "2") {
      await markPaymentSuccessService(order_id, payment_id);
    } else {
      await markPaymentFailedService(order_id);
    }

    // PayHere requires a 200 OK response, otherwise it retries
    res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error.message);
    res.status(400).send("Error");
  }
};