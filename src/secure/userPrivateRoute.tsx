import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/authuser"


const UserPrivateRoute = () => {

    const { authUser } = useUserStore()
    
    if (!authUser) {
        return <Navigate to="sign-in" replace />
    }
  return <Outlet />
}

export default UserPrivateRoute
