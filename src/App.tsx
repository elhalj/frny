// import Form from "./components/Form"

import { /* Navigate*/ Route, Routes } from "react-router-dom";
import SignUp from "./client/components/FormulaireInscription";
import Login from "./client/components/FormulaireLogin";
import { useUserStore } from "./client/store/authuser";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import NavBarCheck from "./client/components/NavBarCheck";
import InfoAdmin from "./vendor/components/Infos";
import Sign_Up from "./vendor/components/SignUp";
import Log_In from "./vendor/components/Login";
import Home from "./pages/Home";

function App() {
  const { checkAuth, authUser } = useUserStore();
  useEffect(() => {async function fetchData() {await checkAuth()} fetchData()}, [checkAuth]);

  return (
    <>
      <NavBar />
      <InfoAdmin />
      {authUser && <NavBarCheck />}
      {authUser && <h1>Welcome {authUser.name.toUpperCase()}</h1>}
      {/* <Form /> */}
      <Routes>
        {/* <Route path="/" element={<Navigate to="/sign-in" replace />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/vendor/sign-up" element={<Sign_Up />} />
        <Route path="/vendor/sign-in" element={<Log_In />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default App;
