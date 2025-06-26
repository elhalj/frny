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
  isCheckingClient: boolean;
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
      token: null,
      isCheckingAuth: false,
      isCheckingClient: false,
      signUp: async (data: FormVendor) => {
        set({ isSignUp: true, isError: null });
        try {
          const formData = new FormData();

          // Add all fields to FormData
          Object.entries(data).forEach(([key, value]) => {
            if (key === "profilePic" && value instanceof File) {
              formData.append(key, value); // Raw file
            } else if (key === "address") {
              formData.append(key, JSON.stringify(value)); // Address object as JSON
            } else {
              formData.append(key, value as string); // Simple fields
            }
          });

          const response = await api.post("/vendor/signUp", formData);
          set({ authVendor: response.data, isSignUp: false });
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
            authVendor: response.data,
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
          set({ authVendor: null, token: null });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message });
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
      name: "vendor-store", // Correct the storage name
    }
  )
);
