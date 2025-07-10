import type { Doctor } from "./Doctors";

export interface User {
   firstName: string;
   lastName: string;
   email: string;
   isActive: boolean;
   picture: string;
   password?: string;
   accessToken?: string;
   refreshToken?: string;
   gender: string;
   role: "user" | "doctor" | "admin";
   location: {
      city: string;
      locality: string;
   };
   createdAt: string;
   updatedAt: string;
   details?: Doctor;
}
