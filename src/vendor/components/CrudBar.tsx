import { NavLink } from "react-router-dom";

// CrudBar.jsx
const CrudBar = () => {
  return (
    <div className="w-sm h-screen border-r-2 border-blue-200 text-black overflow-y-hidden">
      <aside>
        <div className="flex flex-col justify-center items-start gap-2">
          <div className="bg-indigo-100 rounded-r-lg p-1 w-full">
            <NavLink to="add">Ajouter un produit</NavLink>
          </div>
          <hr />
          <div className="bg-indigo-100 rounded-r-lg p-1 w-full">
            <NavLink to="edit">Produits</NavLink>
          </div>
        </div>
      </aside>
    </div>
  );
};
export default CrudBar;