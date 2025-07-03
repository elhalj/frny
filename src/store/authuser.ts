import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormUser } from "../constants/types";
import api from "../services/api";
import toast from "react-hot-toast";

export type User = {
  _id: string;
  name: string;
  email: string;
  token?: string;
  firstName: string;
  address: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  image: string;
};

export type UserLogin = Omit<
  FormUser,
  | "name"
  | "firstName"
  | "address"
  | "city"
  | "municipality"
  | "street"
  | "image"
>;

type State = {
  authUser: User | null;
  isSignUp: boolean;
  isLogin: boolean;
  isError: string | null;
  token?: string | null;
  isCheckingAuth: boolean;
  signUp: (data: FormUser) => Promise<void>;
  login: (data: UserLogin) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useUserStore = create<State>()(
  persist(
    (set, get) => ({
      authUser: (() => {
        const userStore = localStorage.getItem("user-store");
        return userStore ? JSON.parse(userStore)?.state?.authUser : null;
      })(),
      isSignUp: false,
      isLogin: false,
      isError: (() => {
        const userstore = localStorage.getItem("user-store");
        return userstore ? JSON.parse(userstore)?.state?.authUser : null;
      })(),
      token: null,
      isCheckingAuth: false,

      signUp: async (data: FormUser) => {
        set({ isSignUp: true, isError: null });
        try {
          const response = await api.post("/user/signUp", data);
          set({ authUser: response.data.data, token: response.data.token, isSignUp: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message, isSignUp: false });
        }
      },

      login: async (data: UserLogin) => {
        set({ isLogin: true, isError: null });
        try {
          const response = await api.post("/user/login", data);
          set({
            authUser: response.data.data,
            token: response.data.token,
            isLogin: false,
          });
          localStorage.setItem(
            "user-store",
            JSON.stringify({
              state: {
                authUser: response.data.data,
                token: response.data.token,
              },
            })
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message, isLogin: false });
        }
      },

      logout: () => {
        set({
          authUser: null,
          token: null,
          isSignUp: false,
          isLogin: false,
          isError: null,
          isCheckingAuth: false,
        });
        toast.success("Déconnexion réussie");
        localStorage.removeItem("user-store");
        window.location.href = "/user/sign-in"; // Redirection après déconnexion
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        const { token } = get();
        if (!token) {
          set({ isCheckingAuth: false });
          return;
        }
        try {
          const response = await api.get("/user/check");
          set({ authUser: response.data.data, isCheckingAuth: false });
        } catch {
          set({
            authUser: null,
            token: null,
            isError: "Erreur inconnue",
            isCheckingAuth: false,
          });
        }
      },
    }),
    {
      name: "user-store", // nom pour localStorage
    }
  )
);
