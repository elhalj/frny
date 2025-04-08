import { create } from "zustand";
import { FormArticle } from "../../types/types";

export type Article = {
  _id: string;
  name: string;
  price: number; // Modification de string à number
  category: string;
  vendor: string | {
    _id: string;
    name: string
  email: string;
  };
  details?: string;
  stock?: number;
  image?: string;
};

type State = {
  article: Article[] | null;
  articleId: string | null;
  //   commande: string | null;
  isArticle: boolean;
  isError: string | null;
  isAdd: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  isChecked: boolean;
  add: (data: FormArticle) => Promise<void>;
  getVendorArticle: (data: FormArticle) => Promise<void>;
  updateArticle: (data: FormArticle, articleId: string) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  publicArticles: Article[] | null; // Nouvel état pour les articles publics
  isPublicLoading: boolean;
  publicError: string | null;
  getAllArticle: () => Promise<void>; // Nouvelle fonction
};
export const useArticleStore = create<State>((set) => ({
  article: null,
  articleId: null,
  //   commande: null,
  isArticle: false,
  isError: null,
  isAdd: false,
  isUpdated: false,
  isDeleted: false,
  isChecked: false,
  publicArticles: null,
  isPublicLoading: false,
  publicError: null,

  add: async (data: FormArticle) => {
    set({ isAdd: true, isError: null });
    try {
      const response = await fetch("http://localhost:5001/api/article/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ajout d'article echoue");
      }

      const json = await response.json();
      set((state) => ({
        article: state.article ? [...state.article, json.data] : [json.data],
        isAdd: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isAdd: false });
    }
  },

  getVendorArticle: async () => {
    set({ isChecked: true });
    try {
      const response = await fetch(
        "http://localhost:5001/api/article/getArticle/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Recuperation de donnee echoue");
      }

      const json = await response.json();
      set({ article: json.data, isChecked: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isChecked: false });
    }
  },

  updateArticle: async (data: FormArticle, articleId: string) => {
    set({ isUpdated: true, isError: null });
    try {
      const response = await fetch(
        `http://localhost:5001/api/article/update/${articleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Modification d'article echoue");
      }

      const json = await response.json();
      set((state) => ({
        article:
          state.article?.map((art) =>
            art._id === articleId ? json.data : art
          ) || null,
        isUpdated: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isUpdated: false });
    }
  },
  deleteArticle: async (articleId: string) => {
    set({ isDeleted: true, isError: null });
    try {
      const response = await fetch(
        `http://localhost:5001/api/article/delete/${articleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Suppression d'article echoue");
      }

    //   const json = await response.json();
    //   set({ article: json.data, isDeleted: false });
      set((state) => ({
        article: state.article?.filter((art) => art._id !== articleId) || null,
        isDeleted: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isDeleted: false });
    }
  },
   // Nouvelle fonction pour récupérer tous les articles publics
  getAllArticle: async () => {
    set({ isPublicLoading: true, publicError: null });
    try {
      const response = await fetch("http://localhost:5001/api/article/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de récupération des articles");
      }

      const json = await response.json();
      console.log(json.data[0]?.vendor);
      set({ publicArticles: json.data, isPublicLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      set({ publicError: message, isPublicLoading: false });
    }
  },
}));
