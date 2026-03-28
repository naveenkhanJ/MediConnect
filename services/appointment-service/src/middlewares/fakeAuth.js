export const fakeAuth = (req, res, next) => {
  req.user = {
    id: "P001",
    name: "Test Patient",
    email: "patient@test.com"
  };
  next();
};