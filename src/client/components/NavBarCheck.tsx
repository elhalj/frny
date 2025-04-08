import { ShoppingCart, UserRoundCheck } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useUserStore } from "../store/authuser";


const NavBarCheck = () => {
  const {logout} = useUserStore();
  return (
    <div  className="flex flex-row xl:flex-row-reverse gap-10 bg-gray-800 p-4">
      <NavLink to="/box" className="text-white">
        <UserRoundCheck className="h-5 w-5 text-white" />
      </NavLink>
      <NavLink to="/bascket" className="text-white">
        <div className="relative">
          <ShoppingCart className="h-5 w-5 text-white" />
          {/* Badge for the number of items in the cart */}
          {/* Replace '3' with the actual number of items in the cart */}
          {/* You can use a state or prop to manage the number of items */}
          {/* Example: const itemCount = 3; */}
          <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            3
          </span>
        </div>
      </NavLink>
      <button type="submit" onClick={() => logout()}>Logout</button>
      
    </div>
  )
}

export default NavBarCheck
