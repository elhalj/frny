import { create } from "zustand";
import { FormVendor } from "../constants/types";
import api from "../services/api";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

type VendorStore = {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
};

export type VendorLogin = Omit<
  FormVendor,
  | "name"
  | "firstName"
  | "address"
  | "city"
  | "municipality"
  | "number"
  | "gender"
  | "profilePic"
>;
export type Vendor = Omit<FormVendor, "password">;

type State = {
  authVendor: VendorStore | null;
  isSignUp: boolean;
  isLogin: boolean;
  isError: string | null;
  token?: string | null;
  isCheckingAuth: boolean;
  signUp: (data: FormData) => Promise<void>;
  login: (data: VendorLogin) => Promise<void>;
  logout: () => void;
  checkAuthVendor: () => Promise<void>;
};

export const useVendorStore = create<State>()(
  persist(
    (set, get) => ({
      authVendor: (() => {
        const vendorstore = localStorage.getItem("vendor-store");
        return vendorstore ? JSON.parse(vendorstore)?.state?.authVendor : null;
      })(),
      isSignUp: false,
      isLogin: false,
      isError: null,
      token: (() => {
        const vendorstore = localStorage.getItem("vendor-store");
        return vendorstore ? JSON.parse(vendorstore)?.state?.token : null;
      })(),
      isCheckingAuth: false,
      signUp: async (data: FormData) => {
        set({ isSignUp: true, isError: null });
        try {
          const response = await api.post("/vendor/signUp", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          set({ authVendor: response.data.data, token: response.data.token, isSignUp: false });
          toast.success("Enregistrement effectué avec succès")
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur Inconnue";
          set({ isError: message, isSignUp: false });
          toast.error( "Une erreur est survenue lors de l'inscription")
        }
      },

      login: async (data: VendorLogin) => {
        set({ isLogin: true, isError: null });
        try {
          const response = await api.post("/vendor/login", data);
          set({
            authVendor: response.data.data,
            token: response.data.token,
            isLogin: false,
          });
          localStorage.setItem(
            "vendor-store",
            JSON.stringify({
              state: {
                authVendor: response.data.data,
                token: response.data.token,
              }
            })
          )
          toast.success('Connecté')
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur Inconnue";
          set({ isError: message, isLogin: false });
          toast.error("Erreur de connexion")
        }
      },

      logout: async () => {
        try {
          await api.post("/vendor/logout");
          set({ authVendor: null, token: null, isCheckingAuth: false });
          localStorage.removeItem("vendor-store");
          window.location.href = "/vendor/sign-in"; // Redirection après déconnexion
          toast.success("Déconnecté")
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message, isCheckingAuth: false });
          toast.error("Erreur de déconnexion")
        }
      },

      checkAuthVendor: async () => {
        set({ isCheckingAuth: true });
        const { token } = get();
        if (!token) {
          set({ isCheckingAuth: false, authVendor: null });
          return;
        }
        try {
          const response = await api.get("/vendor/check");
          set({ authVendor: response.data, isCheckingAuth: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message, isCheckingAuth: false });
        }
      },
    }),
    {
      name: "vendor-store",
    }
  )
);

