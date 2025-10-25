import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessagesWithUser,
  sendMessageToUser,
} from "../controllers/message.controllers.js";
const router = Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessagesWithUser);
router.post("/send/:id", protectRoute, sendMessageToUser);
export default router;
