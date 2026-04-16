export const fakeAuth = (req, res, next) => {
  // Mock a logged-in doctor — Dr. Priya Sharma from doctor_db
  req.user = {
    id: "d5aeffa5-4623-4d93-9fc3-3b971e72751d",
    role: "doctor",
    name: "Dr. Priya Sharma"
  };

  next();
};