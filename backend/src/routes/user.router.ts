import { Router } from "express";
import {
  registeruser,
  loginUser,
  logoutUser,
  currentUser,
  refreshToken,
  doctorProfileUpdate,
  userProfileUpdate,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// public routes
router.route("/register").post(registeruser);
router.route("/login").post(loginUser);
router.route("/renew").get(refreshToken);

// secure route
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/current").get(verifyJwt, currentUser);
router.route("/doctor").patch(verifyJwt, doctorProfileUpdate);
router.route("/user").patch(verifyJwt, userProfileUpdate);

export default router;
