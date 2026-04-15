import * as service from "../services/telemedicine.service.js";

//create session
export const createSessionController = async (req, res) => {
  try {
    const result = await service.createSessionService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// join session
export const joinSessionController = async (req, res) => {
  try {
    const result = await service.joinSessionService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// start session
export const startSessionController = async (req, res) => {
  try {
    const result = await service.startSessionService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// end session
export const endSessionController = async (req, res) => {
  try {
    const result = await service.endSessionService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get by appointment
export const getSessionByAppointmentController = async (req, res) => {
  try {
    const result = await service.getSessionByAppointmentService(
      req.params.appointmentId
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};