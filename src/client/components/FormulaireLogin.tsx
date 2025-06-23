import { useUserStore } from "../store/authuser";
import { FormField } from "../../types/types";
import SlideTo from "../../components/SlideTo";
import { GenericForm } from "../../types/FormulaireTypes";
import { FormEventHandler, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/userContext"; 

// pages/Login.tsx
const Login = () => {
  const {login,authUser, isLogin, isError } = useUserStore();
  // const { handleLogin} = useAuth();
  const navigate = useNavigate();
  const formFields: FormField[] = [
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Mot de passe", required: true },
  ];

  interface LoginFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface LoginForm extends HTMLFormElement {
    readonly elements: LoginFormElements;
  }

  useEffect(() => {
    if (authUser) {
      navigate("/")
    }
  },[authUser, navigate])
  const handleSubmit: FormEventHandler<LoginForm> = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
      });
    } catch (error) {
      // TODO: Provide user feedback here, e.g. set an error state or show a message
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <GenericForm
      fields={formFields}
      onSubmit={handleSubmit}
      submitText="Se connecter"
      isLoading={isLogin}
      error={isError}
      initialValues={{ email: "", password: "" }}
    >
      <SlideTo to="/sign-up" title="Vous n'avez pas de compte ?">
        S'inscrire
      </SlideTo>
    </GenericForm>
  );
};

export default Login;