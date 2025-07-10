import { Appointment } from "../models/appointment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAppointmentList = asyncHandler(async (req, res) => {
  const { date } = req.body;
  if (!date) {
    throw new ApiError(401, "Date is required");
  }
  const d = new Date(date);
  const date_formated = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).getTime();

  const appointmentList = await Appointment.find({
    doctorId: req.user?._id,
    date: date_formated,
    status: "confirmed",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        appointmentList,
        "Appointments fetched successfully",
      ),
    );
});

export { getAppointmentList };
