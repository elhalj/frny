import { ChangeEvent, FormEventHandler, useState } from "react";
import { FormUser } from "../types/types";
import { useUserStore } from "../client/store/authuser";

const Form = () => {
    const { signUp, isSignUp, isError } = useUserStore();

    const [formData, setFormData] = useState<FormUser>({
        name: "",
        firstName: "",
        email: "",
        password: "",
        address: { city: "", municipality: "", number: "" },
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await signUp(formData);
    };

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
        // Vérifier si le champ est imbriqué
        if (name.includes('.')) {
            const [parent, child] = name.split('.') as [keyof FormUser, string];
            
            // Vérifier que la propriété parente est bien un objet
            if (typeof prev[parent] === 'object' && prev[parent] !== null) {
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent] as Record<string, unknown>, // Assertion de type
                        [child]: value
                    }
                };
            }
        }

        // Cas des champs non imbriqués
        return {
            ...prev,
            [name]: value
        };
    });
};

    return (
        <>
            <div className="container mx-auto my-10 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-4 p-2 border shadow-2xl "
                >
                    <label className="flex flex-col p-2 border w-full">
                        Nom:
                        <input
                            type="text"
                            value={formData.name}
                            name="name"
                            onChange={handleChange}
                        />
                    </label>

                    <label className="flex flex-col p-2 border w-full">
                        Prénom:
                        <input
                            type="text"
                            value={formData.firstName}
                            name="firstName"
                            onChange={handleChange}
                        />
                    </label>

                    <label className="flex flex-col p-2 border w-full">
                        Email:
                        <input
                            type="email"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                        />
                    </label>

                    <label className="flex flex-col p-2 border w-full">
                        Mot de passe:
                        <input
                            type="password"
                            value={formData.password}
                            name="password"
                            onChange={handleChange}
                        />
                    </label>

                    <label className="flex flex-col p-2 border w-full">
                        Ville:
                        <input
                            type="text"
                            value={formData.address.city}
                            name="address.city"
                            onChange={handleChange}
                        />
                    </label>

                    <label className="flex flex-col p-2 border w-full">
                        Commune:
                        <input
                            type="text"
                            value={formData.address.municipality}
                            name="address.municipality"
                            onChange={handleChange}
                        />
                    </label>

                    <label className="flex flex-col p-2 border w-full">
                        Numéro:
                        <input
                            type="text"
                            value={formData.address.number}
                            name="address.number"
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit" disabled={isSignUp}>
                        {isSignUp ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                </form>

                {isError && <div className="error">{isError}</div>}
            </div>
        </>
    );
};
export default Form;
