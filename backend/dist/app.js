import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./db/connectDb.js";
import { ApiResponse } from "./utils/ApiResposne.js";
import config from "./config/config.js";
const app = express();
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
}));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.get("/ping", (req, res) => {
    res.send("pong");
});
app.use((req, res, next) => {
    connectDb()
        .then(() => next())
        .catch(() => res.status(500).json(new ApiResponse(500, {}, "Internal Server Error")));
});
import { errorHandler } from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.router.js";
import appointmentRouter from "./routes/appointment.router.js";
import doctorsRouter from "./routes/doctors.router.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/doctors", doctorsRouter);
app.use(errorHandler);
export default app;
