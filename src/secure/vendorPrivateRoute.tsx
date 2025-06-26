import { Navigate, Outlet } from "react-router-dom";
import { useVendorStore } from "../store/authvendor"


const VendorPrivateRoute = () => {

    const { authVendor } = useVendorStore();

    if (!authVendor) {
        return <Navigate to="/vendor/sign-in" replace />
    }
  return <Outlet />
}

export default VendorPrivateRoute
