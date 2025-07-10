import { useEffect, useState } from 'react'
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DateSelector from '@/Dashboard/user/dateSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    api.post("/api/v1/doctors/appointments", { date })
      .then((res: any) => {
        if (res.success) {
          setAppointments(res.data);
          toast.success("Appointments fetched successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message || "Failed to fetch appointments");
      });
  }, [date]);

  return (
    <div className='w-full h-full p-4'>
      <div className='flex justify-between items-center'>
        <h1>Appointments for {date.toDateString()}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className='cursor-pointer'>Change Date</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className='cursor-pointer' onClick={() => setDate(new Date())}>Today</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DateSelector date={date} setDate={setDate} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {appointments.map((appointment: any) => (
          <Card key={appointment._id}>
            <CardHeader>
              <CardTitle className='text-center'>Appointment {appointment._id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-center'>{appointment.userDetails.firstName} {appointment.userDetails.lastName}</p>
              <p className='text-center'>{appointment.startTime}</p>
              <p className='text-center'>{appointment.endTime}</p>
            </CardContent>
          </Card>
        ))}
        {appointments.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='text-center'>No Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-center'>No appointments found for {date.toDateString()}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Appointments
