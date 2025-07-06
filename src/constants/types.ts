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
  profilePic: File | null ; // Modification du type pour les fichiers
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
  image?: File | null;
};

export type FormArticle = {
  name: string;
  price: string;
  details: string;
  category: string;
  stock: string;
  rate?: number;
  image: File | null; // Modification pour gérer les fichiers
  
};

export type Article = {
  _id: string;
  name: string;
  price: number;
  category: string;
  vendor:{
        _id: string;
        name: string;
        email?: string;
      }
  | string;
  rate?: number;
  details?: string;
  stock?: number;
  image?: string | File;
};
