import { ShoppingCart, UserRoundCheck } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useUserStore } from "../store/authuser";


const NavBarCheck = () => {
  const {logout, authUser} = useUserStore();
  return (
    <div  className="flex flex-row items-center xl:flex-row-reverse gap-10 bg-gray-800 p-4 rounded-lg">
      <NavLink to="/box" className="text-white flex flex-col items-center justify-center">
        <UserRoundCheck className="h-5 w-5 text-white" />
        {authUser && <span className="uppercase text-gray-400 ">{authUser.name}</span>}
      </NavLink>
      <NavLink to="/bascket" className="text-white">
        <div className="relative">
          <ShoppingCart className="h-5 w-5 text-white" />
          <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            3
          </span>
        </div>
      </NavLink>
      <button type="submit" onClick={() => logout()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">Logout</button>      
    </div>
  )
}

export default NavBarCheck
