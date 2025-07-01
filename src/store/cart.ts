import { create } from "zustand";
import { Article } from "./article";

type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    vendor: string;
};

type State = {
    cartItems: CartItem[];
    totalAmount: number;
    addToCart: (item: Article) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
};

export const useCartStore = create<State>((set) => ({
    cartItems: (() => {
        const userStore = localStorage.getItem("user-store");
        return userStore ? JSON.parse(userStore)?.state?.cartItems || [] : [];
    })(),
    totalAmount: 0,
    addToCart: (item) => set((state) => {
        const existingItem = state.cartItems.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            return {
                cartItems: state.cartItems.map(cartItem =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                ),
                totalAmount: state.totalAmount + item.price,
            };
        }
        return {
            cartItems: [
                ...state.cartItems,
                {
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    vendor: typeof item.vendor === "string"
                        ? item.vendor
                        : (item.vendor && typeof item.vendor === "object" && "_id" in item.vendor)
                            ? item.vendor._id
                            : "",
                }
            ],
            totalAmount: state.totalAmount + item.price,
        };
    }),
    removeFromCart: (itemId) => set((state) => {
        const itemToRemove = state.cartItems.find(cartItem => cartItem._id === itemId);
        if (!itemToRemove) return state;

        return {
            cartItems: state.cartItems.filter(cartItem => cartItem._id !== itemId),
            totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity),
        };
    }),
    clearCart: () => set({ cartItems: [], totalAmount: 0 }),
}));
