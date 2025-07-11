import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DoctorSelect from "./doctorSelector";
import { useEffect, useState } from "react";
import type { User } from "@/types/User";
import DateSelector from "./dateSelector";
import TimeSelector from "./timeSelector";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

function UserDashboard() {
   const [selectedOption, setSelectedOption] = useState<User | null>(null);
   const [date, setDate] = useState(new Date());
   const [time, setTime] = useState("10:00");
   const [timeList, setTimeList] = useState<string[]>([]);

   const clearForm = () => {
      setSelectedOption(null);
      setDate(new Date());
      setTime("10:00");
      setTimeList([]);
   };

   const bookAppointment = async () => {
      const response = await api.post(`/api/v1/appointments/book`, {
         doctorId: selectedOption?._id,
         date: date.getTime(),
         timeSlot: time,
      });
      if (response.success) {
         toast.success("Appointment booked successfully");
         clearForm();
      }
   };

   useEffect(() => {
      const fetchTimeSlots = async () => {
         try {
            const response = await api.post<string[]>(
               `/api/v1/appointments/timeslots`,
               {
                  id: selectedOption?._id,
                  date: date.toISOString(),
               }
            );
            if (response.success) {
               setTimeList(response.data?.available);
            }
         } catch (error) {
            console.error("Error fetching time slots:", error);
         }
      };
      fetchTimeSlots();
   }, [selectedOption?._id, date]);

   return (
      <div>
         <Card className="p-4 max-w-xl mx-auto">
            <CardHeader>
               <CardTitle className="text-2xl">Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="w-full space-y-2">
                  <h3 className="text-lg font-semibold">Choose a doctor</h3>
                  <DoctorSelect
                     selectedOption={selectedOption}
                     setSelectedOption={setSelectedOption}
                  />
               </div>
               {selectedOption && (
                  <div>
                     <h3 className="text-lg font-semibold">Choose a date</h3>
                     <DateSelector date={date} setDate={setDate} />
                  </div>
               )}
               {date && (
                  <div>
                     <h3 className="text-lg font-semibold">Choose a time</h3>
                     {timeList.length > 0 ? (
                        <TimeSelector
                           time={time}
                           setTime={setTime}
                           list={timeList}
                        />
                     ) : (
                        <p>No time slots available for {date.toDateString()}</p>
                     )}
                  </div>
               )}
               {time && (
                  <div className="flex flex-col gap-2 border border-gray-200 p-2 rounded-lg">
                     <h3 className="text-lg font-semibold">Confirm your appointment</h3>
                     <p>
                        Doctor: {selectedOption?.firstName}{" "}
                        {selectedOption?.lastName}
                     </p>
                     <p>Date: {date.toDateString()}</p>
                     <p>Time: {time}</p>
                     <Button onClick={bookAppointment}>Book Appointment</Button>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}

export default UserDashboard;
