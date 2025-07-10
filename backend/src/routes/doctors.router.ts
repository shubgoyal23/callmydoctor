import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getAppointmentList } from "../controllers/doctors.controller.js";
const router = Router();

// public routes

// secure route
router.route("/").post(verifyJwt, getAppointmentList);

export default router;
