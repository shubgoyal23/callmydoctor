import { useSelector } from "react-redux";

function UserDashboard() {
   const {isDoctor} = useSelector((state: any) => state.user);
   return (
      <div>
        <h1>User Dashboard</h1>
      </div>
   )
}

export default UserDashboard