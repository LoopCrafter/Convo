import { Router } from "express";
import {
  login,
  logout,
  onboarding,
  register,
} from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/)
      .withMessage(
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      ),

    body("phone").notEmpty().withMessage("Phone number is required"),
  ],
  validate,
  register
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/logout", logout);
router.post(
  "/onboarding",
  requireAuth,
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("bio").notEmpty().withMessage("Bio is required"),
    body("avatarUrl").isURL().withMessage("Valid avatar URL is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("nativeLanguage")
      .notEmpty()
      .withMessage("Native language is required"),
    body("learningLanguage")
      .notEmpty()
      .withMessage("Learning language is required"),
  ],
  validate,
  onboarding
);

router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated",
    user: req.user,
  });
});
export default router;
