import { useEffect, useState } from "react";
import { useUserStore } from "../../store/authuser";
import { Order, useOrder } from "../../store/order"


const Orders = () => {
  const { orders, fetchOrders } = useOrder();
  const { authUser } = useUserStore();
  const userId = authUser?._id;
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (authUser) {
        await fetchOrders();
        const updatedUserOrder: Order[] = orders.filter(order => order.user._id === userId);
        setMyOrders(updatedUserOrder);
      }
    };
      fetchUserOrders();
  }, [authUser, fetchOrders, orders, userId]);

  return (
    <div>
      {myOrders.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        myOrders.map(order => (
          <div key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Price: {order.totalPrice}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default Orders

