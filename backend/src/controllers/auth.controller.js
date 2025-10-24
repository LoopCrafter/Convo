import { upsertStreamUser } from "../../lib/stream.js";
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
    generateAccessToken(res, user._id);
    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        email: user.email,
        image: user.avatarUrl,
      });
      console.log("Stream user upserted successfully");
    } catch (err) {
      console.error("Error upserting Stream user:", err);
    }
    return res.status(201).json({
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

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
}

const onboarding = async (req, res) => {
  const userId = req.userId;

  console.log("Onboarding userId:", userId);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser.id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.avatarUrl || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Onboarding successful",
      user: { ...updatedUser.toJSON(), password: undefined },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
  res.status(200).json({ success: true, message: "Onboarding successful" });
};
export { login, register, logout, onboarding };
