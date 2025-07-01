import { useEffect, useState } from "react";
import { useCartStore } from "../../store/cart";
import { useOrder } from "../../store/order";
import { useUserStore } from "../../store/authuser";

const Bascket = () => {
  const { cartItems, removeFromCart, totalAmount, increaseQuantity, decreaseQuantity } = useCartStore();
  const { authUser } = useUserStore();
  const { createOrder } = useOrder();
  const [cart, setCart] = useState(cartItems);
  useEffect(() => {
    const fetchCart = () => {
      if (cartItems.length > 0) {
        setCart(cartItems);
        
      }
    };
    fetchCart();
  }, [cartItems]);

  const vendorId = cart.length > 0 ? cart[0].vendor : "";

  return (
    <div className="h-screen bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Shopping Cart</h2>
      {cart.length > 0 ? (
        <ul className="container mx-auto px-4 grid grid-cols-1 gap-4">
          {cart.map((item) => (
            <li key={item._id} className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-gray-400">${item.price}</p>
                <button type="button" onClick={() => removeFromCart(item._id)} className="mt-2 m-2 bg-red-600 text-white py-1 px-4 rounded-lg">
                  Remove
                </button>
                <button type="button" onClick={() => decreaseQuantity(item._id)} className="mt-2 m-2 bg-red-600 text-white py-1 px-4 rounded-lg">
                  <span className="mr-2 text-2xl">-</span>Decrease Quantity
                </button>
                <button type="button" onClick={() => increaseQuantity(item._id)} className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-lg">
                  <span className="mr-2 text-2xl">+</span>Increase Quantity
                </button>
                <p className="mt-2 text-gray-400">Quantity: {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">Your cart is empty</p>
      )}
      <div className="flex justify-between mt-4">
        <span className="text-gray-400">Total Amount: ${totalAmount}</span>
        <button
          type="button"
          onClick={() =>
            createOrder({
              user: authUser?._id, // Replace with actual user id
              article: cart.map(item => item._id),
              quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: totalAmount,
              vendor: vendorId
            })
          }
          className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Bascket;

