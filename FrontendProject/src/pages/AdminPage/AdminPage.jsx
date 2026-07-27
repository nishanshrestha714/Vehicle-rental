import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";

function AdminPage() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/signin"/>;
}

export default AdminPage;
