import express from "express";
import {
  createBroadcast,
  getBroadcasts
} from "../controllers/broadcast.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Faculty posts message
router.post(
  "/",
  protect,
  allowRoles("faculty"),
  createBroadcast
);

// Students view messages
router.get("/", protect, getBroadcasts);

export default router;
