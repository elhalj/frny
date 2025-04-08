// pages/SignUp.tsx
import { GenericForm } from "../../types/FormulaireTypes";
import { FormUser } from "../../types/types";
import { useUserStore } from "../store/authuser";
import { FormField } from "../../types/types";
import SlideTo from "../../components/SlideTo";

const SignUp = () => {
  const { signUp, isSignUp, isError } = useUserStore();

  const formFields: FormField[] = [
    { name: "name", type: "text", label: "Nom", required: true },
    { name: "firstName", type: "text", label: "Prénom", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Mot de passe", required: true },
    { name: "address.city", type: "text", label: "Ville", required: true, nested: true },
    { name: "address.municipality", type: "text", label: "Commune", required: true, nested: true },
    { name: "address.number", type: "text", label: "Numéro", required: true, nested: true },
  ];

  const initialValues: FormUser = {
    name: "",
    firstName: "",
    email: "",
    password: "",
    address: {
      city: "",
      municipality: "",
      number: ""
    }
  };

  return (
    <GenericForm<FormUser>
      fields={formFields}
      onSubmit={signUp}
      submitText="S'inscrire"
      loadingText="Inscription en cours..."
      isLoading={isSignUp}
      error={isError}
      initialValues={initialValues}
    >
      <SlideTo to="/sign-in" title="Vous avez deja un compte ?">
        Se connecter
      </SlideTo>
    </GenericForm>
  );
};

export default SignUp;