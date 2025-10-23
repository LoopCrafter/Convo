import User from "../models/User.model.js";
import { generateAccessToken } from "../utils/index.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    generateAccessToken(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { ...user.toJSON(), password: undefined },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const register = async (req, res) => {
  const { fullName, email, password, phone, bio } = req.body;
  try {
    const existPhone = await User.findOne({ phone });

    if (existPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone is already registered",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }
    const randomIdx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${randomIdx}`;

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      bio,
      avatarUrl: randomAvatar,
    });
    generateAccessToken(res, user);

    return res
      .status(201)
      .json({
        success: true,
        message: "User registered",
        data: { ...user.toJSON(), password: undefined },
      });
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
