import { create } from "zustand";
import api from "../services/api";

export type Order = {
    _id?: string;
    user: string;
    article: string;
    quantity: number;
    totalPrice: number;
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    vendor: string;
    createdAt?: string;
    updatedAt?: string;
};

type State = {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    createOrder: (orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateOrder: (orderId: string, orderData: Partial<Order>) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
};
export const useOrder = create<State>((set) => ({
    orders: [],
    isLoading: false,
    error: null,
    
    fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get("/commande/get");
            set({ orders: response.data.data, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            set({ error: message, isLoading: false });
        }
    },

    createOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/commande/create", orderData);
            set((state) => ({
                orders: [...state.orders, response.data.data],
                isLoading: false,
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            set({ error: message, isLoading: false });
        }
    },

    updateOrder: async (orderId, orderData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/commande/update/${orderId}`, orderData);
            set((state) => ({
                orders: state.orders.map(order =>
                    order._id === orderId ? response.data.data : order
                ),
                isLoading: false,
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            set({ error: message, isLoading: false });
        }
    },

    deleteOrder: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/commande/delete/${orderId}`);
            set((state) => ({
                orders: state.orders.filter(order => order._id !== orderId),
                isLoading: false,
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            set({ error: message, isLoading: false });
        }
    },
}))