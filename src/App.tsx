
import {Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./screen/Home";
import Dashboard from "./screen/admin/Dashboard";
import VendorPrivateRoute from "./secure/vendorPrivateRoute";
import Signup from "./screen/client/Signup";
import Login from "./screen/client/Login";
import SignupVendor from "./screen/admin/Signup";
import LoginVendor from "./screen/admin/Login";

function App() {



  return (
    <>
      <NavBar />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Login />} />

        {/* Routes vendeur */}
        <Route path="/vendor">
          <Route path="sign-up" element={<SignupVendor />} />
          <Route path="sign-in" element={<LoginVendor />} />
          <Route path="admin/dashboard" element={<VendorPrivateRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="admin/add" element={<div>Ajouter un produit</div>} />
            <Route path="admin/edit" element={<div>Modifier un produit</div>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
