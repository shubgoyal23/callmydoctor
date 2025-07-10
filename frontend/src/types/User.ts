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
   role: {
      type: string;
      enum: ["user", "doctor", "admin"];
      default: "user";
   };
   location: {
      city: string;
      locality: string;
   };
   createdAt: string;
   updatedAt: string;
}
