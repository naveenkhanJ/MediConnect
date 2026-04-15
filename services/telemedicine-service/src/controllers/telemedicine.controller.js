import * as telemedicineService from "../services/telemedicine.service.js";

export const createSession = async (req, res, next) => {
  try {
    const result = await telemedicineService.createTelemedicineSession(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const result = await telemedicineService.getTelemedicineSessionById(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSessionByAppointmentId = async (req, res, next) => {
  try {
    const result =
      await telemedicineService.getTelemedicineSessionByAppointmentId(
        req.params.appointmentId
      );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const startSession = async (req, res, next) => {
  try {
    const result = await telemedicineService.startTelemedicineSession(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    const result = await telemedicineService.endTelemedicineSession(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const result = await telemedicineService.cancelTelemedicineSession(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const joinSession = async (req, res, next) => {
  try {
    const result = await telemedicineService.joinTelemedicineSession(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listSessions = async (req, res, next) => {
  try {
    const result = await telemedicineService.listTelemedicineSessions();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};