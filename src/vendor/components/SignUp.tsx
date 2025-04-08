// pages/Sign_Up.tsx
import { GenericForm } from "../../types/FormulaireTypes";
import {  FormVendor } from "../../types/types";
import { FormField } from "../../types/types";
import SlideTo from "../../components/SlideTo";
import { useVendorStore } from "../store/authvendor";
import { UserCog2Icon } from "lucide-react";

const Sign_Up = () => {
  const { signUp, isSignUp, isError } = useVendorStore();

  const formFields: FormField[] = [
    { name: "name", type: "text", label: "Nom", required: true },
    { name: "firstName", type: "text", label: "Prénom", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Mot de passe", required: true },
    { name: "address.city", type: "text", label: "Ville", required: true, nested: true },
    { name: "address.municipality", type: "text", label: "Commune", required: true, nested: true },
    { name: "address.number", type: "text", label: "Numéro", required: true, nested: true },
    // Corriger la définition du champ 'gender'
{
  name: "gender",
  type: "select",
  label: "Genre",
  required: true,
  options: [
    { value: "Homme", label: "Homme" },
    { value: "Femme", label: "Femme" },
  ]
},
    { name: "profilePic", type: "file", label: "Photo de profil", required: true },
  ];

  const initialValues: FormVendor = {
    name: "",
    firstName: "",
    email: "",
    password: "",
    address: {
      city: "",
      municipality: "",
      number: ""
    },
    gender: "",
    profilePic: null,
  };
  console.log("Initial values:", initialValues);

  return (
    <GenericForm<FormVendor>
      fields={formFields}
      onSubmit={signUp}
      submitText="S'inscrire"
      loadingText="Inscription en cours..."
      isLoading={isSignUp}
      error={isError}
      initialValues={initialValues}
    >
      <div><UserCog2Icon /></div>
      <SlideTo to="/vendor/sign-in" title="Vous avez deja un compte ?">
        Se connecter
      </SlideTo>
    </GenericForm>
  );
};

export default Sign_Up;