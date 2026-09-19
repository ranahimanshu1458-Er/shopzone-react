import { useEffect, useState } from "react";

function AdminOrders() {
  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to update order status."
        );
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      setMessage(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to update order status.");
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>

        <p>
          Only administrators can access this page.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="admin-page">
        <h2>Manage Orders</h2>

        <p>Loading orders...</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>Manage Orders</h2>

      <button
        onClick={() =>
          (window.location.href = "/admin")
        }
      >
        Back to Dashboard
      </button>

      {message && <p>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders have been placed yet.</p>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div
              className="admin-order-card"
              key={order._id}
            >
              <h3>Order #{order._id}</h3>

              <p>
                <strong>Customer:</strong>{" "}
                {order.user?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.user?.email || "Unknown"}
              </p>

              <p>
                <strong>Order Status:</strong>
              </p>

              <select
                value={order.status}
                onChange={(event) =>
                  handleStatusChange(
                    order._id,
                    event.target.value
                  )
                }
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {order.paymentStatus}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                ₹
                {Number(
                  order.totalAmount
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  order.createdAt
                ).toLocaleDateString("en-IN")}
              </p>

              <h4>Items</h4>

              {order.items.map((item, index) => (
                <div
                  className="admin-order-item"
                  key={index}
                >
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

export default AdminOrders;