import { ApiError } from "../utils/ApiError.js";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    else {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
