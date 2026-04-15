export const authenticate = (req, res, next) => {
  const id = Number(req.headers["x-user-id"] || "1");
  const role = String(req.headers["x-user-role"] || "ADMIN").toUpperCase();
  req.user = {
    id: Number.isFinite(id) ? id : 1,
    role: ["ADMIN", "PATIENT", "DOCTOR"].includes(role) ? role : "ADMIN",
  };
  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required. Send header X-User-Role: ADMIN",
    });
  }
  next();
};

