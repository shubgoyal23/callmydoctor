import { useEffect, useState } from "react";
import type { DoctorDetails } from "../../types/Doctors";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import type { User } from "@/types/User";

function DoctorSelect() {
   const [selectedOption, setSelectedOption] = useState<User | null>(null);
   const [doctorsList, setDoctorsList] = useState<User[]>([] as User[]);

   useEffect(() => {
      const fetchDoctors = async () => {
         try {
            const response = await api.get<User[]>(
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
