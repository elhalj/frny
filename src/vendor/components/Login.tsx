
import { FormField } from "../../types/types";
import SlideTo from "../../components/SlideTo";
import { GenericForm } from "../../types/FormulaireTypes";
import { useVendorStore } from "../store/authvendor";
import { UserCog2Icon } from "lucide-react";

// pages/Log_In.tsx
const Log_In = () => {
  const { login, isLogin, isError } = useVendorStore();

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
          <div><UserCog2Icon /></div>
      <SlideTo to="/vendor/sign-up" title="Vous n'avez pas de compte ?">
        S'inscrire
      </SlideTo>
    </GenericForm>
  );
};

export default Log_In