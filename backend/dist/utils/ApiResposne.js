class ApiResponse {
    constructor(statusCode, data, message = "Success", success = statusCode < 400) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}
export { ApiResponse };
