import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Article } from "./article";

type CartItem = {
    _id: string;
    image: string;
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
    increaseQuantity: (itemId: string) => void;
    decreaseQuantity: (itemId: string) => void;
};

// function calculateTotalAmount(cartItems: CartItem[]) {
//     return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
// }

export const useCartStore = create<State>()(
    persist(
        (set) => ({
            cartItems: [],
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
                            image: typeof item.image === "string" ? item.image : "",
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
            increaseQuantity: (itemId) => set((state) => {
                const itemToUpdate = state.cartItems.find(cartItem => cartItem._id === itemId);
                if (!itemToUpdate) return state;

                return {
                    cartItems: state.cartItems.map(cartItem =>
                        cartItem._id === itemId
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                    ),
                    totalAmount: state.totalAmount + itemToUpdate.price,
                };
            }),

            decreaseQuantity: (itemId) => set((state) => {
                const itemToUpdate = state.cartItems.find(cartItem => cartItem._id === itemId);
                if (!itemToUpdate) return state;
                if (itemToUpdate.quantity <= 1) {
                    return {
                        cartItems: state.cartItems.filter(cartItem => cartItem._id !== itemId),
                        totalAmount: state.totalAmount - (itemToUpdate.price * itemToUpdate.quantity),
                    };
                }
                return {
                    cartItems: state.cartItems.map(cartItem =>
                        cartItem._id === itemId
                            ? { ...cartItem, quantity: cartItem.quantity - 1 }
                            : cartItem
                    ),
                    totalAmount: state.totalAmount - itemToUpdate.price,
                };
            })
        }),
        { name: "cart-store" }
    )
);

