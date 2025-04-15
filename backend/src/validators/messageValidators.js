// backend/src/validators/messageValidators.js
import { body } from "express-validator";

export const sendMessageRules = [
  body("user_id")
    .exists().withMessage("user_id is required")
    .isInt({ gt: 0 }).withMessage("user_id must be a positive integer"),
  body("data")
    .exists().withMessage("data is required")
    .isString().withMessage("data must be a string")
    .isLength({ min: 1 }).withMessage("data cannot be empty"),
];
