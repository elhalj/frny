// types/types.ts
export interface FormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  nested?: boolean;
  placeholder?: string;
  title?: string;
  options?: Array<{ value: string | number; label: string }>;
} // Suppression de l'import mal placé

export type FormVendor = {
  name: string;
  firstName: string;
  email: string;
  password: string;
  address: string;
  city: string;
  municipality: string;
  number: string;
  gender: "Homme" | "Femme";
  profilePic: File | null | undefined; // Modification du type pour les fichiers
};

export type FormUser = {
  name: string;
  firstName: string;
  email: string;
  password: string;
  token?: string;
  address: string;
  street: string;
  city: string;
  municipality: string;
  image?: File | null | undefined;
};

export type FormArticle = {
  name: string;
  price: number;
  details: string;
  category: string;
  stock: number;
  rate?: number;
  image: File | null; // Modification pour gérer les fichiers
  vendor?:
    | string
    | {
        _id: string;
        name: string;
      };
  email?: string;
};
