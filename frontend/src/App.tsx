import { useSelector } from "react-redux";
import Auth from "./Auth/Auth";
import Home from "./Dashboard/Home";
import { useEffect } from "react";
import { api } from "./lib/api";
import { login } from "./store/userSlice/userSlice";
import { useDispatch } from "react-redux";
function App() {
   const { loggedIn } = useSelector((state: any) => state.user);
   const dispatch = useDispatch();

   useEffect(() => {
      api.get("/api/v1/users/current").then((res) => {
         if (res.success) {
            dispatch(login(res.data))
         }
      })
   }, [])

   return !loggedIn ? <Auth /> : <Home />;
}

export default App;
