import { Doctor } from "../models/doctors.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const generateAccessTokenAndRefresToken = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { refreshToken, accessToken };
    }
    catch (error) {
        console.log(error);
        throw new ApiError(500, "error generating refrestToken");
    }
};
const registeruser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, isDoctor } = req.body;
    if (!firstName || !email || !password) {
        throw new ApiError(401, "firstName, Email, and Password is required to register user");
    }
    const checkuser = await User.findOne({ email });
    if (checkuser) {
        throw new ApiError(403, "User with same Email id is already registered");
    }
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: isDoctor ? "doctor" : "user",
        isActive: true,
    });
    const checkUserRegistered = await User.findOne({ email })?.select("_id firstName lastName");
    if (!checkUserRegistered) {
        throw new ApiError(500, "user registration failed");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "user Registered successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(401, "Email, and Password is required to Login");
    }
    const finduser = await User.findOne({ email });
    if (!finduser) {
        throw new ApiError(403, "User not found, check Email id or register one");
    }
    if (!finduser.isActive) {
        throw new ApiError(404, "User with this email is not found");
    }
    const checkpass = await finduser.checkPassword(password);
    if (!checkpass) {
        throw new ApiError(403, "Wrong Email or Password");
    }
    let doctor = undefined;
    if (finduser.role === "doctor") {
        const docDet = await Doctor.findOne({ doctorId: finduser._id });
        if (!docDet) {
            doctor = {};
        }
        else {
            doctor = docDet;
        }
    }
    finduser.details = doctor;
    const { refreshToken, accessToken } = await generateAccessTokenAndRefresToken(finduser?._id?.toString());
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    };
    finduser.password = undefined;
    finduser.refreshToken = refreshToken;
    finduser.accessToken = accessToken;
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, finduser, "User Logged in successfully"));
});
const logoutUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(401, "User not loggedin");
    }
    const finduser = await User.findByIdAndUpdate(_id, {
        $unset: {
            refreshToken: 1,
        },
    }, { new: true });
    if (!finduser) {
        throw new ApiError(403, "User not found");
    }
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    };
    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out Successfully"));
});
const currentUser = asyncHandler(async (req, res) => {
    let doc = {};
    if (req.user?.role === "doctor") {
        const doctor = await Doctor.findOne({ doctorId: req.user._id });
        if (doctor) {
            doc = doctor;
        }
    }
    const ret = {
        ...req.user?.toObject(),
        details: doc,
    };
    return res
        .status(200)
        .json(new ApiResponse(200, ret, "User fetched successfully"));
});
const refreshToken = asyncHandler(async (req, res) => {
    let token = req.cookies.refreshToken || req.headers.refreshtoken;
    token = token?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "RefreshToken not found");
    }
    const decodedToken = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (typeof decodedToken === "string") {
        throw new ApiError(401, "Invalid token");
    }
    const user = await User.findById(decodedToken._id.toString());
    if (!user || !user._id) {
        throw new ApiError(401, "User not found");
    }
    if (!(user?.refreshToken === token)) {
        throw new ApiError(401, "Invalid token");
    }
    const { refreshToken, accessToken } = await generateAccessTokenAndRefresToken(user._id.toString());
    user.password = undefined;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user, "Tokens Renewed successfully"));
});
const doctorProfileUpdate = asyncHandler(async (req, res) => {
    const { specialization, services, experience, languages, fee, availability, slotTime, } = req.body;
    const user = await Doctor.findOneAndUpdate({ doctorId: req.user?._id }, {
        specialization,
        services,
        experience,
        languages,
        fee,
        availability,
        slotTime,
    }, { new: true, upsert: true });
    res
        .status(200)
        .json(new ApiResponse(200, user, "Doctor profile updated successfully"));
});
const userProfileUpdate = asyncHandler(async (req, res) => {
    const { gender, location, firstName, lastName, picture } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, {
        gender,
        location,
        firstName,
        lastName,
        picture,
    }, { new: true });
    res
        .status(200)
        .json(new ApiResponse(200, user, "User profile updated successfully"));
});
export { registeruser, loginUser, logoutUser, currentUser, refreshToken, doctorProfileUpdate, userProfileUpdate, };
