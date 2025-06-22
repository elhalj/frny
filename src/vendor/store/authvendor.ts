import { create } from "zustand";
import { FormVendor } from "../../types/types";
import api from "../../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  image: string;
};

export type UserLogin = Omit<FormVendor, "name" | "firstName" | "address" | "gender" | "profilePic">;
export type Vendor = Omit<FormVendor, "password">;

type State = {
  authVendor: User | null;
  isSignUp: boolean;
  isLogin: boolean;
  isError: string | null;
  token?: string | null;
  isCheckingAuth: boolean;
  isCheckingClient: boolean;
  signUp: (data: FormVendor) => Promise<void>;
  login: (data: UserLogin) => Promise<void>;
  logout: () => void;
  checkAuthVendor: () => Promise<void>;
};

export const useVendorStore = create<State>((set) => ({
  authVendor: null,
  isSignUp: false,
  isLogin: false,
  isError: null,
  token: null,
  isCheckingAuth: false,
  isCheckingClient: false,
  signUp: async (data: FormVendor) => {
    set({ isSignUp: true, isError: null });
    try {
       const formData = new FormData();
    
    // Ajouter tous les champs au FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === "profilePic" && value instanceof File) {
        formData.append(key, value); // Fichier brut
      } 
      else if (key === "address") {
        formData.append(key, JSON.stringify(value)); // Objet address en JSON
      }
      else {
        formData.append(key, value as string); // Champs simples
      }
    });
      
    const response = await api.post("/vendor/signUp", data);
      set({ authVendor: response.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur Inconnue";
      set({ isError: message, isSignUp: false });
    }
  },

  login: async (data: UserLogin) => {
    set({ isLogin: true, isError: null });
    try {
      const response = await api.post("/vendor/login", data);

      
      set({ authVendor: response.data, token: response.data.token, isLogin: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur Inconnue";
      set({ isError: message, isLogin: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/vendor/logout");
      set({ authVendor: null, token: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnu";
      set({ isError: message });
    }
  },

  checkAuthVendor: async () => {
    set({ isCheckingAuth: true });
   
    try {
      const response = await api.get("/vendor/check");
      set({ authVendor: response.data, token: response.data.token, isCheckingAuth: false });
    } catch (error) {
      localStorage.removeItem("token");
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isCheckingAuth: false });
    }
  },
  // getClient: async (data: Vendor) => {
  //   set({ isCheckingClient: true, isError: null });
  //   try {
  //     const response = await fetch(
  //       "http://localhost:5001/api/vendor/getClient",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message || "Erreur de récupération du client"
  //       );
  //     }

  //     const json = await response.json();
  //     set({ authVendor: json.data, isCheckingClient: false });
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : "Erreur inconnue";
  //     set({ isError: message, isCheckingClient: false });
  //   }
  // },
}));
