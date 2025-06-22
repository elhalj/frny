import { create } from "zustand";
import { FormUser } from "../../types/types";
import api from "../../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
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

export const useUserStore = create<State>((set) => ({
  authUser: null,
  isSignUp: false,
  isLogin: false,
  isError: null,
  token: null,
  isCheckingAuth: false,
  signUp: async (data: FormUser) => {
    set({ isSignUp: true, isError: null });
    try {
      const response = await api.post("/user/signUp",data);

      set({ authUser: response.data.data, isSignUp: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur Inconnue";
      set({ isError: message, isSignUp: false });
    }
  },

  login: async (data: UserLogin) => {
    set({ isLogin: true, isError: null });
    try {
      const response = await api.post("/user/login", data);

      set({ authUser: response.data.data, token: response.data.token, isLogin: false });
    } catch (error) {
      
      const message =
        error instanceof Error ? error.message : "Erreur Inconnue";
      set({ isError: message, isLogin: false });
    }
  },

  logout: async () => {
    try {
        await api.post("/user/logout");
      set({ authUser: null, token: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnu";
      set({ isError: message });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isCheckingAuth: false });
      return;
    }
    try {
      const response = await api.get("/user/check");

      set({ authUser: response.data, token: token, isCheckingAuth: false });
    } catch (error) {
      localStorage.removeItem("token");
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isCheckingAuth: false });
    }
  },
}));
