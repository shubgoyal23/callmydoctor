import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Mongoose schema
const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    location: {
        city: { type: String },
        locality: { type: String },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        validate: {
            validator: (v) => /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: { type: String, required: true },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true },
    picture: { type: String },
    role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
}, { timestamps: true });
// Pre-save middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    if (!this.password)
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// Instance methods
userSchema.methods.checkPassword = async function (password) {
    if (!this.password)
        return false;
    return bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id?.toString(), name: this.firstName }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id?.toString() }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10d",
    });
};
// Exporting the model
export const User = mongoose.models.User || mongoose.model("User", userSchema);
