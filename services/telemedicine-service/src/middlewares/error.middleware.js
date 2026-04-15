import { errorResponse } from "../utils/response.util.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("error.middleware");

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(`[${req.method}] ${req.path}`, {
    message: err.message,
    statusCode,
    stack: err.stack,
  });

  return res.status(statusCode).json(
    errorResponse(err.message || "Internal server error")
  );
};