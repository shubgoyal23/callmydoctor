import mongoose, { Schema } from "mongoose";
// Mongoose schema
const appointmentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timeSlot: { type: String },
    status: { type: String },
    date: { type: Number },
    fee: { type: Number },
    paymentId: { type: String },
}, { timestamps: true });
// Exporting the model
export const Appointment = mongoose.models.Appointment ||
    mongoose.model("Appointment", appointmentSchema);
