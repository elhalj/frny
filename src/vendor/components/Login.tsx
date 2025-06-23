
import { FormField } from "../../types/types";
import SlideTo from "../../components/SlideTo";
import { GenericForm } from "../../types/FormulaireTypes";
import { useVendorStore } from "../store/authvendor";
import { UserCog2Icon } from "lucide-react";
import { FormEventHandler } from "react";

// pages/Log_In.tsx
const Log_In = () => {
  const { login, isLogin, isError } = useVendorStore();

  const formFields: FormField[] = [
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Mot de passe", required: true },
  ];

  interface LoginFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface SignupForm extends HTMLFormElement {
    readonly elements: LoginFormElements;
  }
  const handleSubmit: FormEventHandler<SignupForm> = async (e) => {
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
  }

  return (
    <GenericForm
      fields={formFields}
      onSubmit={handleSubmit}
      submitText="Se connecter"
      isLoading={isLogin}
      error={isError}
      initialValues={{ email: "", password: "" }}
      >
          <div><UserCog2Icon /></div>
      <SlideTo to="/vendor/sign-up" title="Vous n'avez pas de compte ?">
        S'inscrire
      </SlideTo>
    </GenericForm>
  );
};

export default Log_In