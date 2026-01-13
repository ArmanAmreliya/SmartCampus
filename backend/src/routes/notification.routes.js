import express from "express";
import { raiseRequest } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/request",
  protect,
  allowRoles("student"),
  raiseRequest
);

export default router;
