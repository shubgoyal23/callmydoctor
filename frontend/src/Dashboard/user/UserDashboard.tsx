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
   const [formStage, setFormStage] = useState<number>(0);
   const [appointments, setAppointments] = useState<any[]>([]);

   const selectDoctor = (user: User | null) => {
      setSelectedOption(user);
      setFormStage(1);
   };

   const selectDate = (date: Date) => {
      setDate(date);
      setFormStage(2);
   };

   const selectTime = (time: string) => {
      setTime(time);
      setFormStage(3);
   };

   const clearForm = () => {
      setSelectedOption(null);
      setFormStage(0);
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
         setFormStage(4);
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

   useEffect(() => {
      const fetchAppointments = async () => {
         try {
            const response = await api.get(`/api/v1/appointments/appointments`);
            if (response.success) {
               setAppointments(response.data);
            }
         } catch (error) {
            console.error("Error fetching appointments:", error);
         }
      };
      fetchAppointments();
   }, []);

   return (
      <div>
         <Card className="p-4 max-w-3xl mx-auto">
            <CardHeader>
               <CardTitle className="text-2xl">Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="w-full space-y-2">
                  <h3 className="text-lg font-semibold">Choose a doctor</h3>
                  <DoctorSelect
                     selectedOption={selectedOption}
                     setSelectedOption={selectDoctor}
                  />
               </div>
               {formStage >= 1 && formStage < 4 && (
                  <div>
                     <h3 className="text-lg font-semibold">Choose a date</h3>
                     <DateSelector date={date} setDate={selectDate} />
                  </div>
               )}
               {formStage >= 2 && formStage < 4 && (
                  <div>
                     <h3 className="text-lg font-semibold">Choose a time</h3>
                     {timeList.length > 0 ? (
                        <TimeSelector
                           time={time}
                           setTime={selectTime}
                           list={timeList}
                        />
                     ) : (
                        <p>No time slots available for {date.toDateString()}</p>
                     )}
                  </div>
               )}
               {formStage >= 3 && formStage < 4 && (
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
               {formStage >= 4 && (
                  <div className="flex flex-col gap-2 border border-gray-200 p-2 rounded-lg">
                     <h3 className="text-lg font-semibold text-center mb-2">Appointment booked successfully</h3>
                     <Button onClick={clearForm}>Book Another Appointment</Button>
                  </div>
               )}
            </CardContent>
         </Card>

         <Card className="p-4 max-w-3xl mx-auto mt-6">
            <CardHeader>
               <CardTitle className="text-2xl">Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
               {appointments.length > 0 ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                     {appointments.map((appointment: any) => (
                        <Card key={appointment._id} className="w-full max-w-sm bg-card text-card-foreground">
                           <CardHeader>
                              <CardTitle className="text-center">Appointment</CardTitle>
                           </CardHeader>
                           <CardContent>
                              <p className="text-center">Doctor: {appointment.doctorFirstName} {appointment.doctorLastName}</p>
                              <p className="text-center">Date: {new Date(appointment.date).toDateString()}</p>
                              <p className="text-center">Time: {appointment.timeSlot}</p>
                              <p className="text-center">Status: {appointment.status}</p>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               ) : (
                  <p className="text-center">No appointments found</p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}

export default UserDashboard;
