import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <div className="flex flex-col  justify-between bg-gray-800 p-4">
        <nav className="flex items-center justify-between ">
          <div className="text-white text-lg font-bold">
            <NavLink to="/">Brand</NavLink>
          </div>
          <ul className="flex space-x-10">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/catalogue">Catalogue</NavLink>
            </li>
            <li>
              <NavLink to="/sign-in">Se connecter</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
