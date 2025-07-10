import { useSelector } from "react-redux";
import Appointments from "./Appointments";
import ProfessionalDetailsForm from "./Details";

function DoctorDashboard() {
   const { user } = useSelector((state: any) => state.user);
   console.log(user)
   return (
      <div className="">
         <Appointments />
         {!user?.details?._id && (
            <div className="w-full h-full p-4 mt-6">
               <h1 className="text-2xl font-bold mb-2">Fill your details</h1>
               <p className="text-sm text-muted-foreground mb-4">Fill your details to start accepting appointments</p>
               <ProfessionalDetailsForm />
            </div>
         )}
      </div>
   )
}

export default DoctorDashboard
