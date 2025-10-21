const login = (req, res) => {
  res.json({ message: "Login route" });
};

const register = (req, res) => {
  res.json({ message: "Register route" });
};

const logout = (req, res) => {
  res.json({ message: "Logout route" });
};

export { login, register, logout };
