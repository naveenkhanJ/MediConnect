export const fakeAuth = (req, res, next) => {
  const patientId = req.headers['x-patient-id'] || 'P001';
  req.user = {
    id: patientId,
    name: "Test Patient",
    email: "patient@test.com"
  };
  next();
};