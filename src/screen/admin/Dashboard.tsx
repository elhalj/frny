
import { NavLink, Outlet } from "react-router-dom"


const Dashboard = () => {
  return (
    <div className="flex flex-col  rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <NavLink to="/vendor/admin/dashboard/add" className="block  hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
        Add article
      </NavLink>
      <Outlet/>
    </div>
  )
}

export default Dashboard
