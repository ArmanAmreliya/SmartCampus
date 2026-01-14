import express from "express";
import {
  setAvailability,
  getFacultyStatus
} from "../controllers/availability.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/set",
  protect,
  allowRoles("faculty"),
  setAvailability
);

router.get("/status", protect, getFacultyStatus);

export default router;
