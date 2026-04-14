export const fakeAuth = (req, res, next) => {
  // Mock a logged-in doctor
  req.user = {
    id: "doc124",       // doctorId
    role: "doctor",     // role
    name: "Dr. John Doe"
  };

  next();
};