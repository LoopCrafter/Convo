import User from "../models/User.model.js";

const login = (req, res) => {
  res.json({ message: "Login route" });
};

const register = async (req, res) => {
  const { fullName, email, password, phone, bio } = req.body;
  try {
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      bio,
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const logout = (req, res) => {
  res.json({ message: "Logout route" });
};

export { login, register, logout };
