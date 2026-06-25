 import { Navigate , Outlet } from "react-router";
  import { useSelector } from "react-redux";

 function PrivatePage () {
    const {userInfo} = useSelector ((state ) => state.auth);
    return  userInfo ?<Outlet/> :<Navigate to = "/signin"/>

 };
 export default PrivatePage;
