import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormUser } from "../../types/types";
import api from "../../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  token?: string;
  firstName: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

export type UserLogin = Omit<FormUser, "name" | "firstName" | "address">;

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
      isError: null,
      token: null,
      isCheckingAuth: false,

      signUp: async (data: FormUser) => {
        set({ isSignUp: true, isError: null });
        try {
          const response = await api.post("/user/signUp", data);
          set({ authUser: response.data.data, isSignUp: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur inconnue";
          set({ isError: message, isSignUp: false });
        }
      },

      login: async (data: UserLogin) => {
        set({ isLogin: true, isError: null });
        const token = localStorage.getItem("user-store");
        try {
          const response = await api.post("/user/login", data);
          set({
            authUser: response.data.data,
            token: token || response.data.token,
            isLogin: false,
          });
          localStorage.setItem("token", response.data.token);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur inconnue";
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
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        const token = get().token;
        if (!token) {
          set({ isCheckingAuth: false });
          return;
        }
        try {
          const response = await api.get("/user/check");
          set({ authUser: response.data.data, isCheckingAuth: false });
        } catch {
          set({ authUser: null, token: null, isError: "Erreur inconnue", isCheckingAuth: false });
        }
      },
    }),
    {
      name: "user-store", // nom pour localStorage
    }
  )
);