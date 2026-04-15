import PlatformUser from "../models/platformUser.model.js";
import DoctorVerification from "../models/doctorVerification.model.js";
import { Op } from "sequelize";

export const listUsers = ({ q, role, status } = {}) => {
  const where = {};

  if (q) {
    where[Op.or] = [
      { email: { [Op.like]: `%${q}%` } },
      { fullName: { [Op.like]: `%${q}%` } },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (status) {
    where.status = status;
  }

  return PlatformUser.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

export const findUserById = (id) => PlatformUser.findByPk(id);

export const findUserByEmail = (email) =>
  PlatformUser.findOne({ where: { email } });

export const createUser = (data) => PlatformUser.create(data);

export const updateUser = async (id, updates) => {
  const user = await PlatformUser.findByPk(id);
  if (!user) return null;
  await user.update(updates);
  return user;
};

export const deleteUser = async (id) => {
  const user = await PlatformUser.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return user;
};

export const listDoctorVerifications = ({ status, q } = {}) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (q) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${q}%` } },
      { licenseNumber: { [Op.like]: `%${q}%` } },
      { specialty: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
    ];
  }

  return DoctorVerification.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

export const findDoctorVerificationById = (id) =>
  DoctorVerification.findByPk(id);

export const createDoctorVerification = (data) =>
  DoctorVerification.create(data);

export const updateDoctorVerification = async (id, updates) => {
  const row = await DoctorVerification.findByPk(id);
  if (!row) return null;
  await row.update(updates);
  return row;
};
