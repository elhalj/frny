import { create } from "zustand";
import { FormUser } from "../../types/types";

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
  isCheckingAuth: false,
  signUp: async (data: FormUser) => {
    set({ isSignUp: true, isError: null });
    try {
      const response = await fetch("http://localhost:5001/api/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
      const response = await fetch("http://localhost:5001/api/user/login", {
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
        await fetch("http://localhost:5001/api/user/logout", {
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
      const response = await fetch("http://localhost:5001/api/user/check", {
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
}));
