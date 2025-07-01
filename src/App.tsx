import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./screen/Home";
import Dashboard from "./screen/admin/Dashboard";
import VendorPrivateRoute from "./secure/vendorPrivateRoute";
import Signup from "./screen/client/Signup";
import Login from "./screen/client/Login";
import SignupVendor from "./screen/admin/Signup";
import LoginVendor from "./screen/admin/Login";
import ArticleForm from "./screen/admin/ArticleForm";
import UserPrivateRoute from "./secure/userPrivateRoute";
import UserBascket from "./screen/ui/Bascket";
import UserOrders from "./screen/ui/Orders";
import UserProfile from "./screen/ui/Profile";
import UserDashboard from "./screen/client/UserDashboard";

function App() {
  // Pour éviter les erreurs de chargement de la page en production
  if (
    import.meta.env.MODE === "production" &&
    window.location.pathname === "/"
  ) {
    window.location.href = "/user/sign-in";
  }
  return (
    <>
      <NavBar />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />}></Route>

        {/* Routes utilisateur */}
        <Route path="/user">
          <Route path="sign-up" element={<Signup />} />
          <Route path="sign-in" element={<Login />} />
          <Route path="client/dashboard" element={<UserPrivateRoute />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="basket" element={<UserBascket />} />
            <Route path="orders" element={<UserOrders />} />
          </Route>
        </Route>

        {/* Routes vendeur */}
        <Route path="/vendor">
          <Route path="sign-up" element={<SignupVendor />} />
          <Route path="sign-in" element={<LoginVendor />} />
          <Route path="admin/dashboard" element={<VendorPrivateRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="add" element={<ArticleForm />} />
            <Route path="edit" element={<ArticleForm />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
