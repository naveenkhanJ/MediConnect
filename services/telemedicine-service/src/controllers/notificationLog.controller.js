import * as notificationLogService from "../services/notificationLog.service.js";

export const listNotificationLogs = async (req, res, next) => {
  try {
    const result = await notificationLogService.listNotificationLogs(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
