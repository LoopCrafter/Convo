import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const requireAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else {
    return res.status(401).json({
      success: false,
      message: "No token provided, unauthorized",
    });
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    console.log("req.cookies.token", decoded);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.log("Authentication error:", err);
    // distinguish error types
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired - please refresh",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token signature",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: err.message || "Server error in authentication",
      });
    }
  }
};

export { requireAuth };
