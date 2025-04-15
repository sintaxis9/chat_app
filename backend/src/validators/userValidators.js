// backend/src/validators/userValidators.js
import { body, query } from "express-validator";

export const registerRules = [
  body("name")
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginRules = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  // name es opcional en loginRules; se valida dentro del controlador si es registro implícito
];

export const checkEmailRules = [
  query("email")
    .exists()
    .withMessage("Email query param is required")
    .isEmail()
    .withMessage("Invalid email format"),
];
