import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getDoctorList,
  getDoctorsSlots,
  bookAppointment,
  getAppointmentList,
  getAppointmentDetails,
} from "../controllers/appointment.controller.js";

const router = Router();

// secure route
router.route("/doctors").post(verifyJwt, getDoctorList);
router.route("/slots").post(verifyJwt, getDoctorsSlots);
router.route("/book").post(verifyJwt, bookAppointment);
router.route("/appointments").get(verifyJwt, getAppointmentList);
router.route("/appointment/:id").get(verifyJwt, getAppointmentDetails);

export default router;
