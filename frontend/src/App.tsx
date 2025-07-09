import { useSelector } from "react-redux";
import Auth from "./Auth/Auth";
import Home from "./Dashboard/Home";
function App() {
   const { loggedIn } = useSelector((state: any) => state.user);

   return !loggedIn ? <Auth /> : <Home />;
}

export default App;
