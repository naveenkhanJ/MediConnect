import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access only." });
    }
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
