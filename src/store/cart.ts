import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Article } from "./article";

type CartItem = {
  _id: string;
  image: string;
  name: string;
    price: number;
    category: string;
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
const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const useCartStore = create<State>()(
  persist(
    (set) => ({
      cartItems: [],
      totalAmount: 0,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem._id === item._id
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
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
                image:
                  item.image instanceof File
                    ? URL.createObjectURL(item.image)
                    : item.image || "",
                name: item.name,
                  price: item.price,
                category: item.category,
                quantity: 1,
                vendor:
                  typeof item.vendor === "string"
                    ? item.vendor
                    : item.vendor &&
                      typeof item.vendor === "object" &&
                      "_id" in item.vendor
                    ? item.vendor._id
                    : "",
              },
            ],
            totalAmount: state.totalAmount + item.price,
          };
        }),
      removeFromCart: (itemId) =>
        set((state) => {
          const newItems = state.cartItems.filter(
            (item) => item._id !== itemId
          );
          return {
            cartItems: newItems,
            totalAmount: calculateTotal(newItems),
          };
        }),
      clearCart: () => set({ cartItems: [], totalAmount: 0 }),
      increaseQuantity: (itemId) =>
        set((state) => {
          const newItems = state.cartItems.map((item) =>
            item._id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return {
            cartItems: newItems,
            totalAmount: calculateTotal(newItems),
          };
        }),

      decreaseQuantity: (itemId) =>
        set((state) => {
          const newItem = state.cartItems.filter((item) =>
            item._id !== itemId
              ? item
              : { ...item, quantity: item.quantity - 1 }
          );
          return {
            cartItems: newItem,
            totalAmount: calculateTotal(newItem),
          };
        }),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        cartItems: state.cartItems.filter((item) => !!item._id), // Éviter les items invalides
      }),
    }
  )
);
