import mongoose, { Schema } from "mongoose";
// Mongoose schema
const doctorSchema = new Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    specialization: { type: String },
    rating: { type: Number },
    services: { type: [String] },
    experience: { type: Number },
    languages: { type: [String] },
    fee: { type: Number },
    availability: { type: [Object] },
    slotTime: { type: Number },
}, { timestamps: true });
// Exporting the model
export const Doctor = mongoose.models.Doctor ||
    mongoose.model("Doctor", doctorSchema);
