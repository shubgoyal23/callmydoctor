export interface Doctor {
   _id: string;
   doctorId: string;
   specialization: string;
   rating: number;
   services: string[];
   experience: number;
   languages: string[];
   fee: number;
   availability: { day: string; time: string[] }[];
   slotTime: number;
   createdAt: string;
   updatedAt: string;
   firstName: string;
   lastName: string;
   email: string;
}
