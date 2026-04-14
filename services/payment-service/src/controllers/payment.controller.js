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