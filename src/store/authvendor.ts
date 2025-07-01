import { create } from "zustand";
import { FormVendor } from "../constants/types";
import api from "../services/api";
import { persist } from "zustand/middleware";

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
  signUp: (data: FormVendor) => Promise<void>;
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
      signUp: async (data: FormVendor) => {
        set({ isSignUp: true, isError: null });
        try {
          const response = await api.post("/vendor/signUp", data);
          set({ authVendor: response.data.data, token: response.data.token, isSignUp: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur Inconnue";
          set({ isError: message, isSignUp: false });
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
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur Inconnue";
          set({ isError: message, isLogin: false });
        }
      },

      logout: async () => {
        try {
          await api.post("/vendor/logout");
          set({ authVendor: null, token: null, isCheckingAuth: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message, isCheckingAuth: false });
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

