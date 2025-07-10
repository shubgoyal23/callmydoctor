import { getRedisClient } from "../db/connectRedis.js";
import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctors.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDoctorList = asyncHandler(async (req, res) => {
  let { category } = req.query;
  // if (!category) {
  //   throw new ApiError(401, "category is required");
  // }

  const doctorDetails = await User.aggregate([
    {
      $match: {
        specialization: category,
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "doctorId",
        as: "details",
      },
    },
    {
      $unwind: "$details",
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        specialization: 1,
        rating: 1,
        services: 1,
        experience: 1,
        languages: 1,
        fee: 1,
        availability: 1,
        slotTime: 1,
        details: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, doctorDetails, "Doctors fetched successfully"));
});

const getDoctorsSlots = asyncHandler(async (req, res) => {
  const { id, date } = req.params;
  if (!id || !date) {
    throw new ApiError(401, "Doctor id and Date is required");
  }
  const doctor = await Doctor.findOne({ doctorId: id });
  if (!doctor) {
    throw new ApiError(403, "Doctor not found");
  }
  const redisClient = await getRedisClient();
  const d = new Date(date);
  const date_formated = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).getTime();
  const slots = await redisClient.smembers(`doctor:${id}:${date_formated}`);

  const ds = {
    ...doctor,
    slots,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, ds, "Doctor fetched successfully"));
});

const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, startTime, endTime } = req.body;
  if (!doctorId || !date || !startTime || !endTime) {
    throw new ApiError(401, "Doctor id, start time, and end time is required");
  }

  const d = new Date(date);
  const date_formated = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).getTime();

  const appointment = await Appointment.create({
    userId: req.user?._id,
    doctorId,
    startTime,
    endTime,
    date: date_formated,
    status: "pending",
  });

  if (!appointment) {
    throw new ApiError(403, "Appointment not booked");
  }

  const redisClient = await getRedisClient();
  await redisClient.lpush(`appointment:Queue`, `${appointment._id}`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        appointment,
        "Appointment booked successfully, please wait for confirmation",
      ),
    );
});

const getAppointmentList = asyncHandler(async (req, res) => {
  const appointmentList = await Appointment.find({
    userId: req.user?._id,
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

const getAppointmentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "Appointment id is required");
  }
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(403, "Appointment not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointment, "Appointment fetched successfully"),
    );
});

export {
  getDoctorList,
  getDoctorsSlots,
  bookAppointment,
  getAppointmentList,
  getAppointmentDetails,
};
