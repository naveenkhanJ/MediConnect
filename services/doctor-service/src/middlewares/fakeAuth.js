export const fakeAuth = (req, res, next) => {
  // Mock a logged-in doctor — Dr. Priya Sharma from doctor_db
  req.user = {
    id: "bb910126-bc62-4d81-8c8f-641325b178e1",
    role: "doctor",
    name: "Dr. Priya Sharma"
  };

  next();
};