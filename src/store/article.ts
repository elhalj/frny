import { create } from "zustand";
// import { FormArticle } from "../constants/types";
import api from "../services/api";

export type Article = {
  _id: string;
  name: string;
  price: number;
  category: string;
  vendor:{
        _id: string;
        name: string;
        email?: string;
      }
  | string;
  rate?: number;
  details?: string;
  stock?: number;
  image?: string | File;
};

type State = {
  articles: Article[] | null;
  articleId: string | null;
  //   commande: string | null;
  isArticle: boolean;
  isError: string | null;
  isAdd: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  isChecked: boolean;
  add: (data: FormData) => Promise<void>;
  getVendorArticle: () => Promise<void>;
  updateArticle: (data: Article, articleId: string) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  publicArticles: Article[] | null; // Nouvel état pour les articles publics
  isPublicLoading: boolean;
  publicError: string | null;
  vendorArticles: Article[] | null;
  isVendorLoading: boolean;
  vendorError: string | null;
  getAllArticle: () => Promise<void>; // Nouvelle fonction
};
export const useArticleStore = create<State>((set) => ({
  articles: null,
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
  vendorArticles: null,
  isVendorLoading: false,
  vendorError: null,

  add: async (data: FormData) => {
    set({ isAdd: true, isError: null });
    try {
      const response = await api.post("/article/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Check if the response is successful
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from server");
      }
      
      set((state) => ({
        articles: state.articles
          ? [...state.articles, response.data.data]
          : [response.data.data],
        vendorArticles: state.vendorArticles
          ? [...state.vendorArticles, response.data.data]
          : [response.data.data],
        isAdd: false,
      }));
    } catch (error) {
      let message = "Unknown error occurred";
      
      if (error && typeof error === "object" && "response" in error) {
        // Server responded with error status
        // @ts-expect-error: error might have response property
        message = error.response?.data?.message || error.response?.data?.error || `Server error: ${error.response?.status}`;
      } else if (error && typeof error === "object" && "request" in error) {
        // Request was made but no response received
        message = "Network error: Unable to connect to server";
      } else if (error instanceof Error) {
        // Something else happened
        message = error.message;
      }
      
      console.error("Article add error:", error);
      set({ isError: message, isAdd: false });
      // throw error; // Re-throw to allow component to handle it
    }
  },

  getAllArticle: async () => {
    set({ isPublicLoading: true });
    try {
      const response = await api.get("/article/get");
      set({ publicArticles: response.data.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ publicError: message });
    } finally {
      set({ isPublicLoading: false });
    }
  },

  getVendorArticle: async () => {
    set({ isVendorLoading: true, vendorError: null });
    try {
      const response = await api.get("/article/getArticle/me");

      set({ vendorArticles: response.data.data, isVendorLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ vendorError: message, isVendorLoading: false });
    }
  },

  updateArticle: async (data: Article, articleId: string) => {
    set({ isUpdated: true, isError: null });
    try {
      const response = await api.put(`/article/update/${articleId}`, data,);
      set((state) => ({
        articles:
          state.articles?.map((art) =>
            art._id === articleId ? response.data.data : art
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
      await api.delete(`/article/delete/${articleId}`);

      set((state) => ({
        articles: state.articles?.filter((art) => art._id !== articleId) || null,
        isDeleted: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      set({ isError: message, isDeleted: false });
    }
  },
}));

