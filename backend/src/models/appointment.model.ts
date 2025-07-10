import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for User properties
interface IAppointment {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  startTime: string;
  endTime: string;
  status: string;
  date: number; // epoch of start of date
  fee: number;
  paymentId: string;
  createdAt: Date;
}

// Combined Document type with methods
export type AppointmentDocument = Document & IAppointment;

// Mongoose schema
const appointmentSchema = new Schema<AppointmentDocument>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: { type: String },
    endTime: { type: String },
    status: { type: String },
    date: { type: Number },
    fee: { type: Number },
    paymentId: { type: String },
  },
  { timestamps: true },
);

// Exporting the model
export const Appointment: Model<AppointmentDocument> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentDocument>("Appointment", appointmentSchema);
