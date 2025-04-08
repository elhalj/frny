import { create } from "zustand";
import { FormVendor } from "../../types/types";

type User = {
  _id: string;
  name: string;
  email: string;
};

export type UserLogin = Omit<FormVendor, "name" | "firstName" | "address" | "gender" | "profilePic">;
export type Vendor = Omit<FormVendor, "password">;

type State = {
  authUser: User | null;
  isSignUp: boolean;
  isLogin: boolean;
  isError: string | null;
  isCheckingAuth: boolean;
  isCheckingClient: boolean;
  signUp: (data: FormVendor) => Promise<void>;
  login: (data: UserLogin) => Promise<void>;
  logout: () => void;
  checkAuth: (data: UserLogin) => Promise<void>;
};

export const useVendorStore = create<State>((set) => ({
  authUser: null,
  isSignUp: false,
  isLogin: false,
  isError: null,
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
      
    const response = await fetch("http://localhost:5001/api/vendor/signUp", {
      method: "POST",
      body: formData, // Pas de header Content-Type (géré automatiquement)
    });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Inscription echoue");
      }
      const json = await response.json();
      set({ authUser: json.data, isSignUp: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur Inconnue";
      set({ isError: message, isSignUp: false });
    }
  },

  login: async (data: UserLogin) => {
    set({ isLogin: true, isError: null });
    try {
      const response = await fetch("http://localhost:5001/api/vendor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Connexion echoue");
      }

      const json = await response.json();
      set({ authUser: json.data, isLogin: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur Inconnue";
      set({ isError: message, isLogin: false });
    }
  },

  logout: async () => {
    try {
      await fetch("http://localhost:5001/api/vendor/logout", {
        method: "POST",
      });
      set({ authUser: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnu";
      set({ isError: message });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await fetch("http://localhost:5001/api/vendor/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Connexion echoue");
      }

      const json = await response.json();
      set({ authUser: json.data, isCheckingAuth: false });
    } catch (error) {
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
  //     set({ authUser: json.data, isCheckingClient: false });
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : "Erreur inconnue";
  //     set({ isError: message, isCheckingClient: false });
  //   }
  // },
}));
