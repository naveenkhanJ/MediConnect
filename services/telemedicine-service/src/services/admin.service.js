import * as adminRepository from "../repositories/admin.repository.js";
import { successResponse } from "../utils/response.util.js";

const allowedRoles = ["ADMIN", "PATIENT", "DOCTOR"];
const allowedUserStatuses = ["ACTIVE", "SUSPENDED", "PENDING"];

const normalizeUserFilters = (query = {}) => {
  const filters = {};
  if (query.q) filters.q = String(query.q).trim();
  if (allowedRoles.includes(query.role)) filters.role = query.role;
  if (allowedUserStatuses.includes(query.status)) filters.status = query.status;
  return filters;
};

const normalizeVerificationFilters = (query = {}) => {
  const filters = {};
  if (query.q) filters.q = String(query.q).trim();
  if (["PENDING", "APPROVED", "REJECTED"].includes(query.status)) {
    filters.status = query.status;
  }
  return filters;
};

export const listUsers = async (query) => {
  const users = await adminRepository.listUsers(normalizeUserFilters(query));
  return successResponse("Users fetched successfully", users);
};

export const createUser = async (payload) => {
  const { email, fullName, role = "PATIENT", status = "ACTIVE" } = payload;
  if (!email || !fullName) {
    const err = new Error("email and fullName are required");
    err.statusCode = 400;
    throw err;
  }
  const existing = await adminRepository.findUserByEmail(email);
  if (existing) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }
  if (!allowedRoles.includes(role)) {
    const err = new Error("Invalid role");
    err.statusCode = 400;
    throw err;
  }
  if (!allowedUserStatuses.includes(status)) {
    const err = new Error("Invalid status");
    err.statusCode = 400;
    throw err;
  }
  const user = await adminRepository.createUser({
    email,
    fullName,
    role,
    status,
  });
  return successResponse("User created successfully", user);
};

export const updateUser = async (id, payload) => {
  const { fullName, role, status } = payload;
  const user = await adminRepository.findUserById(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (role !== undefined) {
    if (!allowedRoles.includes(role)) {
      const err = new Error("Invalid role");
      err.statusCode = 400;
      throw err;
    }
    updates.role = role;
  }
  if (status !== undefined) {
    if (!allowedUserStatuses.includes(status)) {
      const err = new Error("Invalid status");
      err.statusCode = 400;
      throw err;
    }
    updates.status = status;
  }
  const updated = await adminRepository.updateUser(id, updates);
  return successResponse("User updated successfully", updated);
};

export const deleteUser = async (id) => {
  const user = await adminRepository.findUserById(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  if (user.role === "ADMIN") {
    const err = new Error("Demo safety: admin users cannot be deleted");
    err.statusCode = 400;
    throw err;
  }
  await adminRepository.deleteUser(id);
  return successResponse("User deleted successfully", { id: Number(id) });
};

export const listDoctorVerifications = async (query) => {
  const rows = await adminRepository.listDoctorVerifications(
    normalizeVerificationFilters(query)
  );
  return successResponse("Doctor verifications fetched successfully", rows);
};

export const submitDoctorVerification = async (payload) => {
  const { fullName, licenseNumber, specialty, email, platformUserId } =
    payload;
  if (!fullName || !licenseNumber) {
    const err = new Error("fullName and licenseNumber are required");
    err.statusCode = 400;
    throw err;
  }
  const row = await adminRepository.createDoctorVerification({
    fullName,
    licenseNumber,
    specialty: specialty || null,
    email: email || null,
    platformUserId: platformUserId || null,
    status: "PENDING",
  });
  return successResponse("Verification request submitted", row);
};

export const reviewDoctorVerification = async (id, payload) => {
  const { status, adminNotes } = payload;
  if (!["APPROVED", "REJECTED"].includes(status)) {
    const err = new Error("status must be APPROVED or REJECTED");
    err.statusCode = 400;
    throw err;
  }
  const row = await adminRepository.findDoctorVerificationById(id);
  if (!row) {
    const err = new Error("Verification request not found");
    err.statusCode = 404;
    throw err;
  }
  if (row.status !== "PENDING") {
    const err = new Error("Only pending requests can be reviewed");
    err.statusCode = 400;
    throw err;
  }
  const updated = await adminRepository.updateDoctorVerification(id, {
    status,
    adminNotes: adminNotes ?? row.adminNotes,
    reviewedAt: new Date(),
  });
  if (updated.platformUserId) {
    await adminRepository.updateUser(updated.platformUserId, {
      role: "DOCTOR",
      status: status === "APPROVED" ? "ACTIVE" : "PENDING",
    });
  }
  return successResponse("Doctor verification updated", updated);
};
