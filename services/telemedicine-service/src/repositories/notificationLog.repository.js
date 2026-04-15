import NotificationLog from "../models/notificationLog.model.js";

export const createLog = (data) => NotificationLog.create(data);

export const listLogs = ({ limit = 100, offset = 0 } = {}) =>
  NotificationLog.findAll({
    order: [["createdAt", "DESC"]],
    limit: Math.min(Number(limit) || 100, 500),
    offset: Number(offset) || 0,
  });
