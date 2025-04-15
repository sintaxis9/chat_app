// backend/src/middlewares/validate.js
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devolvemos el primer error de validación
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
