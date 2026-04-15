import * as notificationLogRepository from "../repositories/notificationLog.repository.js";
import { successResponse } from "../utils/response.util.js";

export const listNotificationLogs = async (query) => {
  const logs = await notificationLogRepository.listLogs({
    limit: query.limit,
    offset: query.offset,
  });
  return successResponse("Notification logs fetched successfully", logs);
};
