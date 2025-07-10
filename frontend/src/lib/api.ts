import { conf } from "@/conf/conf";

export class ApiError extends Error {
   status: number;
   code: string;
   constructor(status: number, code: string, message: string) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.code = code;
   }
}

const handleResponse = async (response: Response) => {
   try {
      let data = null;
      if (response.status !== 204) {
         try {
            data = await response.json();
         } catch (err) {
            console.warn("Failed to parse response:", err);
         }
      }

      if (!response.ok) {
         const error = new ApiError(
            response.status,
            data?.code || "UNKNOWN_ERROR",
            data?.detail || "An error occurred"
         );
         throw error;
      }

      return {
         data: data.data,
         status: response.status,
         message: data?.detail || "",
         success: true,
      };
   } catch (error) {
      if (!(error instanceof ApiError)) {
         throw new ApiError(500, "UNKNOWN_ERROR", "An error occurred");
      }
      throw error;
   }
};

const request = async <T>(
   endpoint: string,
   method: string,
   body?: T,
   params?: Record<string, string>,
   headers?: Record<string, string>
) => {
   try {
      const url = new URL(`${conf.API_BASE_URL}${endpoint}`);

      if (params) {
         Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, value)
         );
      }

      const options: RequestInit = {
         method,
         headers: {
            "Content-Type": "application/json",
            ...headers,
         },
         credentials: "include",
         body: JSON.stringify(body),
      };

      const response = await fetch(url, options);
      return handleResponse(response);
   } catch (error) {
      throw error;
   }
};

// Public API
export const api = {
   get: <T>(endpoint: string, params?: Record<string, string>) =>
      request<T>(endpoint, "GET", undefined, params),
   post: <T>(endpoint: string, body: T, params?: Record<string, string>) =>
      request<T>(endpoint, "POST", body, params),
   put: <T>(endpoint: string, body: T, params?: Record<string, string>) =>
      request<T>(endpoint, "PUT", body, params),
   patch: <T>(endpoint: string, body: T, params?: Record<string, string>) =>
      request<T>(endpoint, "PATCH", body, params),
   delete: <T>(endpoint: string, params?: Record<string, string>) =>
      request<T>(endpoint, "DELETE", undefined, params),
};
