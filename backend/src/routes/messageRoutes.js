// backend/src/routes/messageRoutes.js
import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { validate } from "../middlewares/validate.js";
import { sendMessageRules } from "../validators/messageValidators.js";

const router = Router();

router.post("/send", sendMessageRules, validate, sendMessage);
router.get("/", getMessages);

export default router;
