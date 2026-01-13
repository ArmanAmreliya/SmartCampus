import express from "express";
import {
  requestAppointment,
  updateAppointment,
  getFacultyAppointments
} from "../controllers/appointment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("student"),
  requestAppointment
);

router.get(
  "/faculty",
  protect,
  allowRoles("faculty"),
  getFacultyAppointments
);

router.patch(
  "/:id",
  protect,
  allowRoles("faculty"),
  updateAppointment
);

export default router;
