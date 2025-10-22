import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

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
router.post("/login", login);
router.get("/login", login);

router.post("/logout", logout);

export default router;
