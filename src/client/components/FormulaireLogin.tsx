import { useUserStore } from "../store/authuser";
import { FormField } from "../../types/types";
import SlideTo from "../../components/SlideTo";
import { GenericForm } from "../../types/FormulaireTypes";

// pages/Login.tsx
const Login = () => {
  const { login, isLogin, isError } = useUserStore();

  const formFields: FormField[] = [
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Mot de passe", required: true },
  ];

  return (
    <GenericForm
      fields={formFields}
      onSubmit={login}
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