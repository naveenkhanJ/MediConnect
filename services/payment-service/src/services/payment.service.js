import axios from "axios";
import {
  createPayment,
  findPaymentById,
  findPaymentByAppointmentId,
  updatePayment
} from "../repositories/payment.repository.js";

export const createPaymentService = async ({
  appointmentId,
  patientId,
  amount,
  currency = "LKR",
  gateway = "PAYHERE"
}) => {
  return createPayment({
    appointmentId,
    patientId,
    amount,
    currency,
    gateway,
    status: "PENDING"
  });
};

export const getPaymentByIdService = async (paymentId) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const getPaymentByAppointmentIdService = async (appointmentId) => {
  const payment = await findPaymentByAppointmentId(appointmentId);

  if (!payment) {
    throw new Error("Payment not found for appointment");
  }

  return payment;
};

export const markPaymentSuccessService = async (paymentId) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "SUCCESS") {
    throw new Error("Payment already marked as success");
  }

  payment.status = "SUCCESS";
  payment.transactionId = `TXN-${Date.now()}`;
  await updatePayment(payment);

  try {
    await axios.put(
      `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments/${payment.appointmentId}/confirm-payment`,
      {
        paymentId: payment.id
      }
    );
  } catch (error) {
    console.log("Appointment service update failed for now.");
  }

  return payment;
};

export const markPaymentFailedService = async (paymentId) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.status = "FAILED";
  await updatePayment(payment);

  return payment;
};