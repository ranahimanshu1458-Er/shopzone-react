import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { clearCart } from "../redux/cartSlice";
import { API_URL } from "../config";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
const [expiry, setExpiry] = useState("");
const [cvv, setCvv] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + shipping;

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      name.trim() === "" ||
      address.trim() === "" ||
      phone.trim() === ""
    ) {
      setMessage("Please fill in all delivery details.");
      return;
    }

    const token = localStorage.getItem("shopzoneToken");
    if (paymentMethod === "Online Payment") {
  const cleanCardNumber = cardNumber.replace(/\s/g, "");

  if (
    cleanCardNumber !== "4111111111111111" ||
    cvv !== "123" ||
    expiry.trim() === ""
  ) {
    setMessage(
      "Invalid demo payment details. Use card 4111 1111 1111 1111 and CVV 123."
    );
    return;
  }
}

    if (!token) {
      setMessage("Please login before placing an order.");
      return;
    }

    setPlacingOrder(true);
    setMessage("");

    const orderItems = cartItems.map((item) => ({
      product: item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
         body: JSON.stringify({
  items: orderItems,
  shippingAddress: {
    name,
    phone,
    address,
  },
  totalAmount: total,
  paymentMethod,
  paymentStatus:
    paymentMethod === "Online Payment"
      ? "Paid"
      : "Pending",
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("ORDER ERROR:", data);

        setMessage(
          data.error
            ? `Order failed: ${data.error}`
            : data.message || "Failed to place order."
        );

        setPlacingOrder(false);
        return;
      }

      setOrderId(data.order._id);
      setMessage("Order placed successfully!");

      dispatch(clearCart());

      setName("");
      setAddress("");
      setPhone("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }

    setPlacingOrder(false);
  }

  if (orderId) {
    return (
      <section className="checkout-page">
        <h2>🎉 Order Placed Successfully!</h2>

        <p>Thank you for shopping with ShopZone.</p>

        <p>
          <strong>Order ID:</strong> {orderId}
        </p>

        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>

        <button
          onClick={() => (window.location.href = "/orders")}
        >
          View My Orders
        </button>

        <button
          onClick={() => (window.location.href = "/products")}
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page">
        <h2>Checkout</h2>

        <p>Your cart is empty.</p>

        <button
          onClick={() => (window.location.href = "/products")}
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-container">

        <div className="checkout-form-section">
          <h3>Delivery Details</h3>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <textarea
              placeholder="Delivery Address"
              rows="5"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />

            <h3>Payment Method</h3>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Online Payment"
                checked={paymentMethod === "Online Payment"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              Online Payment
            </label>
            {paymentMethod === "Online Payment" && (
  <div className="fake-payment-form">
    <h4>Demo Card Payment</h4>

    <input
  type="text"
  placeholder="Card Number"
  maxLength="19"
  value={cardNumber}
  onChange={(event) => setCardNumber(event.target.value)}
/>

    <div className="payment-row">
     <input
  type="text"
  placeholder="MM/YY"
  maxLength="5"
  value={expiry}
  onChange={(event) => setExpiry(event.target.value)}
/>

    <input
  type="password"
  placeholder="CVV"
  maxLength="3"
  value={cvv}
  onChange={(event) => setCvv(event.target.value)}
/>
    </div>

    <p>
      Demo card: 4111 1111 1111 1111
    </p>

    <p>
      Use any future expiry date and CVV 123.
    </p>
  </div>
)}

            <button
              type="submit"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

          {message && <p>{message}</p>}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹
                {(item.price * item.quantity).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          ))}

          <hr />

          <p>
            <strong>Subtotal:</strong>{" "}
            ₹{subtotal.toLocaleString("en-IN")}
          </p>

          <p>
            <strong>Shipping:</strong>{" "}
            ₹{shipping.toLocaleString("en-IN")}
          </p>

          <h3>
            Total: ₹{total.toLocaleString("en-IN")}
          </h3>
        </div>

      </div>
    </section>
  );
}

export default Checkout;