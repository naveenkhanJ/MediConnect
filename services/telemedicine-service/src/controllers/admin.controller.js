import * as adminService from "../services/admin.service.js";

export const listUsers = async (req, res, next) => {
  try {
    const result = await adminService.listUsers(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const result = await adminService.createUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const result = await adminService.updateUser(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listDoctorVerifications = async (req, res, next) => {
  try {
    const result = await adminService.listDoctorVerifications(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const submitDoctorVerification = async (req, res, next) => {
  try {
    const result = await adminService.submitDoctorVerification(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const reviewDoctorVerification = async (req, res, next) => {
  try {
    const result = await adminService.reviewDoctorVerification(
      req.params.id,
      req.body
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
