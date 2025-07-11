class ApiError extends Error {
    constructor(statusCode, message, errors = [], stack, data = null, success = statusCode < 400) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = data;
        this.success = success;
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = data;
        this.success = success;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
