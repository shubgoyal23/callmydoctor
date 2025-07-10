import { useEffect, useState } from "react";
import type { Doctor } from "../../types/Doctors";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

function DoctorSelect() {
   const [selectedOption, setSelectedOption] = useState<Doctor | null>(null);
   const [doctorsList, setDoctorsList] = useState<Doctor[]>([] as Doctor[]);

   useEffect(() => {
      const fetchDoctors = async () => {
         try {
            const response = await api.get<Doctor[]>(
               "/api/v1/appointments/doctors"
            );
            setDoctorsList(response.data);
         } catch (error) {
            console.error("Error fetching doctors:", error);
         }
      };
      fetchDoctors();
   }, []);

   return (
      <div className="w-full h-full">
         <Select
            value={selectedOption?._id}
            onValueChange={(value) =>
               setSelectedOption(
                  doctorsList.find((doctor) => doctor._id === value) || null
               )
            }
         >
            <SelectTrigger>
               <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
               {doctorsList.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                     {doctor.firstName} {doctor.lastName}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
}

export default DoctorSelect;
