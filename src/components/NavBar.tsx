import { NavLink, useLocation } from "react-router-dom";
import { useUserStore } from "../client/store/authuser";
import InfoAdmin from "../vendor/components/Infos";
import { useEffect, useState } from "react";
import NavBarCheck from "../client/components/NavBarCheck";

const NavBar = () => {
  const { authUser } = useUserStore();
  const location = useLocation();
  const [isScrolling, setIsScrolling] = useState<{ isScrolling: boolean }>({ isScrolling: false });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling({ isScrolling: window.scrollY > 10 });
    };

    window.addEventListener("scroll", handleScroll, {passive: true});
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="sticky top-0">
      <nav
        className={` flex justify-around items-center p-4 transition duration-300 ease-in-out ${
          isScrolling.isScrolling ? "bg-gray-800/50 backdrop-blur-lg shadow-lg" : "bg-gray-800"
        }`}
      >
        <div className="text-white text-lg font-bold">
          <NavLink
            to="/"
            className="hover:underline hover:text-blue-400 transition duration-300 ease-in-out"
          >
            Brand
          </NavLink>
        </div>
        <ul className="flex items-center space-x-10">
          <li>
            <NavLink
              to="/"
              className={`hover:text-blue-400 transition duration-300 ease-in-out ${
                location.pathname === "/" ? "font-bold" : ""
              }`}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/catalogue"
              className={`hover:text-blue-400 transition duration-300 ease-in-out ${
                location.pathname === "/catalogue" ? "font-bold" : ""
              }`}
            >
              Catalogue
            </NavLink>
          </li>
          <li>
            {authUser ? (
              <NavBarCheck/>
            ) : (
              <NavLink
                to="/sign-in"
                className="hover:text-blue-400 transition duration-300 ease-in-out"
              >
                Se connecter
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
      <InfoAdmin isScrolling={isScrolling.isScrolling}/>
    </div>
  );
};

export default NavBar;

