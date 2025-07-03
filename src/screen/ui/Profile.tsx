import { NavLink } from "react-router-dom"


const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
      <NavLink to="/user/client/dashboard/orders">My Orders</NavLink>
    </div>
  )
}

export default Profile
