export const successResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message) => {
  return {
    success: false,
    message,
  };
};