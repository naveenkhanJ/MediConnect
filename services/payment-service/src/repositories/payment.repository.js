import Payment from "../models/payment.model.js";

export const createPayment = async (data) => {
  return Payment.create(data);
};

export const findPaymentById = async (id) => {
  return Payment.findByPk(id);
};

export const findPaymentByAppointmentId = async (appointmentId) => {
  return Payment.findOne({ where: { appointmentId } });
};

export const updatePayment = async (payment) => {
  return payment.save();
};