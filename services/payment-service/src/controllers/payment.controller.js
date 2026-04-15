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

    const merchantId = process.env.PAYHERE_MERCHANT_ID || "1211149";
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "MzgwMzg0NjQzMDMwNzQ4MzY4NDEwMjI2OTM3NjI4NjU1Njgy";

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
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
      notify_url: "https://procurer-speed-shading.ngrok-free.dev",
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
    const { order_id, status_code } = req.body;

    // status_code 2 = SUCCESS, 0 = FAILED, -1 = CANCELLED, -2 = CHARGEBACK
    if (status_code === "2") {
      await markPaymentSuccessService(order_id);
    } else {
      await markPaymentFailedService(order_id);
    }

    // PayHere requires a 200 OK response, otherwise it retries
    res.status(200).send("OK");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};