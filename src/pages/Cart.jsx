import { useDispatch, useSelector } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

 if (cartItems.length === 0) {
  return (
    <section className="cart-page">
      <h2>Your Cart</h2>

      <p>Your cart is empty.</p>

      <button onClick={() => window.location.href = "/"}>
        Continue Shopping
      </button>
    </section>
  );
}

  return (
    <section className="cart-page">

      <h2>Your Cart</h2>

      <div className="cart-items">

        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="cart-item-details">
              <h3>{item.name}</h3>

              <p>
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              <div className="quantity-controls">

                <button
                  onClick={() =>
                    dispatch(decreaseQuantity(item.id))
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(increaseQuantity(item.id))
                  }
                >
                  +
                </button>

              </div>

              <button
                onClick={() =>
                  dispatch(removeFromCart(item.id))
                }
              >
                Remove
              </button>

            </div>

          </div>
        ))}

      </div>

      <div className="cart-summary">

        <h3>
          Total: ₹{totalPrice.toLocaleString("en-IN")}
        </h3>

        <button onClick={() => dispatch(clearCart())}>
          Clear Cart
        </button>

        <button
  onClick={() => {
    const token = localStorage.getItem("shopzoneToken");

    if (!token) {
      alert("Please login before proceeding to checkout.");
      window.location.href = "/login";
      return;
    }

    window.location.href = "/checkout";
  }}
>
  Proceed to Checkout
</button>
      </div>

    </section>
  );
}

export default Cart;