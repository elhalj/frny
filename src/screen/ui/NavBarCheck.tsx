import {
  Notebook,
  ShoppingCart,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUserStore } from "../../store/authuser";
import { useVendorStore } from "../../store/authvendor";
import { useCartStore } from "../../store/cart";
import { useArticleStore } from "../../store/article";


const vite_uploadUserImage = import.meta.env.VITE_UPLOAD_URL_USER_PROFILE
const vite_uploadAdminImage = import.meta.env.VITE_UPLOAD_URL_VENDOR_PROFILE
const NavBarCheck = () => {
  const { logout, authUser } = useUserStore();
  const { authVendor, logout: vendorLogout } = useVendorStore();
  const { cartItems } = useCartStore();
  const { vendorArticles } = useArticleStore();
  return (
    <div>
      {authUser && (
        <div className="flex flex-row items-center xl:flex-row-reverse gap-10 bg-gray-800 p-4 rounded-lg">
          <NavLink
            to="/user/client/dashboard/profile"
            className="text-white flex flex-col items-center justify-center"
          >
            {/* <UserRoundCheck className="h-5 w-5 text-white" /> */}
            {/* user image */}
            {authUser &&<div><img src={`${vite_uploadUserImage}/${authUser.image}`} alt={authUser.name}  className="w-10 h-10 rounded-full"/></div>}
            {authUser && (
              <span className="uppercase text-gray-400 ">{authUser.name}</span>
            )}
          </NavLink>
          <NavLink to="/user/client/dashboard/basket" className="text-white">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartItems.length > 0 ? (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cartItems.length}
                </span>
              ) : (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  0
                </span>
              )}
            </div>
          </NavLink>
          <button
            type="submit"
            onClick={() => logout()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      )}
      {authVendor && (
        <div className="flex flex-row items-center xl:flex-row-reverse gap-10 bg-gray-800 p-4 rounded-lg">
          <NavLink
            to="/vendor/admin/dashboard"
            className="text-white flex flex-col items-center justify-center"
          >
            {/* <LucideAward className="h-5 w-5 text-white" /> */}
            {/* user image */}
            {authVendor && (
              <div>
                <img
                  src={`${vite_uploadAdminImage}/${authVendor.profilePic}`}
                  alt={authVendor.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            )}
            {authVendor && (
              <span className="uppercase text-gray-400 ">
                {authVendor.name}
              </span>
            )}
          </NavLink>
          <NavLink to="/vendor/basket" className="text-white">
            <div className="relative">
              <Notebook className="h-5 w-5 text-white" />
              {(vendorArticles?.length ?? 0) > 0 ? (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {vendorArticles?.length ?? 0}
                </span>
              ) : (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  0
                </span>
              )}
            </div>
          </NavLink>
          <button
            type="submit"
            onClick={() => vendorLogout()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBarCheck;
