import express from "express";
import { getUsers, getBroadcastStats } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/users", protect, allowRoles("admin"), getUsers);
router.get("/stats", protect, allowRoles("admin"), getBroadcastStats);

export default router;
