export interface DoctorDetails {
   specialization: string;
   rating: number;
   services: string[];
   experience: number;
   languages: string[];
   fee: number;
   availability: { day: string; time: string[] }[];
   slotTime: number;
}
