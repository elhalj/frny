
import {Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./screen/Home";
import Dashboard from "./screen/admin/Dashboard";
import VendorPrivateRoute from "./secure/vendorPrivateRoute";
import Signup from "./screen/client/Signup";
import Login from "./screen/client/Login";
import SignupVendor from "./screen/admin/Signup";
import LoginVendor from "./screen/admin/Login";
import ArticleForm from "./screen/admin/ArticleForm";

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
            <Route path="add" element={<ArticleForm />} />
            <Route path="edit" element={<ArticleForm />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
