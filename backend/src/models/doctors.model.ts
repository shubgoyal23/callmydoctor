import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for User properties
interface IDoctor {
  _id: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  specialization: string;
  rating: number;
  services: string[];
  experience: number;
  languages: string[];
  fee: number;
  availability: { day: string; time: string[] }[];
  slotTime: number;
}

// Combined Document type with methods
export type DoctorDocument = Document & IDoctor;

// Mongoose schema
const doctorSchema = new Schema<DoctorDocument>(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    specialization: { type: String },
    rating: { type: Number },
    services: { type: [String] },
    experience: { type: Number },
    languages: { type: [String] },
    fee: { type: Number },
    availability: { type: [Object] },
    slotTime: { type: Number },
  },
  { timestamps: true },
);

// Exporting the model
export const Doctor: Model<DoctorDocument> =
  mongoose.models.Doctor ||
  mongoose.model<DoctorDocument>("Doctor", doctorSchema);
