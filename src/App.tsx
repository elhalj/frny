// import Form from "./components/Form"

import { /* Navigate*/ Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./client/components/FormulaireInscription";
import Login from "./client/components/FormulaireLogin";
import { useUserStore } from "./client/store/authuser";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import NavBarCheck from "./client/components/NavBarCheck";
import Sign_Up from "./vendor/components/SignUp";
import Log_In from "./vendor/components/Login";
import Home from "./pages/Home";
import { useVendorStore } from "./vendor/store/authvendor";
import Dashboard from "./vendor/admin/Dashboard";

function App() {
  const { checkAuth, authUser } = useUserStore();
  const { checkAuthVendor, authVendor } = useVendorStore();

useEffect(() => {
  const initializeAuth = async () => {
    await checkAuth();
    await checkAuthVendor();
    
    // Attendre que l'authentification soit confirmée
   
  };
  initializeAuth();
}, [checkAuth, checkAuthVendor, authVendor]); // Retirer getVendorArticle des dépendances
  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     await Promise.all([checkAuth(), checkAuthVendor(), getVendorArticle()]);
  //   };
  //   initializeAuth();
  // }, [checkAuth, checkAuthVendor, getVendorArticle]);
  console.log(authVendor) 

 

  return (
    <>
      {/* <NavBarVendor /> */}
      {!authVendor ? <NavBar/> : null}
      {/* {authVendor && (
        <div className="animate-fadeIn ease-in-out duration-300" style={{animation: 'fadeIn ease-in-out 0.3s forwards'}}>
          Welcome Sir {authVendor.name}
        </div>
      )} */}
      {/* <InfoAdmin /> */}
      {authUser && <NavBarCheck />}
      {authUser && <h1>Welcome {authUser.name}</h1>}
      {/* <Form /> */}
     
<Routes>
  {/* Routes publiques */}
  <Route path="/" element={<Home />} />
  <Route path="/sign-up" element={<SignUp />} />
  <Route path="/sign-in" element={<Login />} />

  {/* Routes vendeur */}
  <Route path="/vendor">
    <Route path="sign-up" element={authVendor ? <Log_In /> : <Sign_Up />} />
    <Route 
      path="sign-in" 
      element={!authVendor ? <Log_In /> : <Navigate to="../admin/dashboard" replace />} 
    />
    <Route 
      path="admin/dashboard" 
      element={authVendor ? (
        <Dashboard  />
      ) : (
        <Navigate to="../sign-in" replace />
      )}
    >
    <Route path="admin/add" element={<div>Ajouter un produit</div>} />
    <Route path="admin/edit" element={<div>Modifier un produit</div>} /></Route>
  </Route>
</Routes>
    </>
  );
}

export default App;
