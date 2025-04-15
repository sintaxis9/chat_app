// backend/src/routes/userRoutes.js
import { Router } from "express";
import {
  registerUser,
  loginUser,
  checkEmail,
} from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import {
  registerRules,
  loginRules,
  checkEmailRules,
} from "../validators/userValidators.js";

const router = Router();

router.post("/register", registerRules, validate, registerUser);
router.post("/login", loginRules, validate, loginUser);
router.get("/check", checkEmailRules, validate, checkEmail);

export default router;
