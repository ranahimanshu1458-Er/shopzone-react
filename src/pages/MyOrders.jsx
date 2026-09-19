import { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("shopzoneToken");

    if (!token) {
      setMessage("Please login to view your orders.");
      setLoading(false);
      return;
    }

    async function loadOrders() {
      try {
        const response = await fetch(
          "http://127.0.0.1:5001/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders");
        }

        setOrders(data);
      } catch (error) {
        console.error(error);
        setMessage("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <section className="orders-page">
        <h2>My Orders</h2>
        <p>Loading orders...</p>
      </section>
    );
  }

  if (message) {
    return (
      <section className="orders-page">
        <h2>My Orders</h2>
        <p>{message}</p>

        <button onClick={() => (window.location.href = "/login")}>
          Login
        </button>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div>
          <p>You have not placed any orders yet.</p>

          <button
            onClick={() => (window.location.href = "/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order #{order._id}</h3>

            <p>
  <strong>Order Status:</strong> {order.status}
</p>

<p>
  <strong>Payment Method:</strong> {order.paymentMethod}
</p>

<p>
  <strong>Payment Status:</strong> {order.paymentStatus}
</p>

              <p>
                <strong>Total:</strong>{" "}
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>

              <h4>Items</h4>

              {order.items.map((item, index) => (
                <div className="order-item" key={index}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹
                    {Number(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

              <h4>Delivery Address</h4>

              <p>
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.phone}
                <br />
                {order.shippingAddress.address}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyOrders;