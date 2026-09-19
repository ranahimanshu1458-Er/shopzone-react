import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartSlice";

function Navbar() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shopzoneUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleLogout() {
    // Clear login session
    localStorage.removeItem("shopzoneToken");
    localStorage.removeItem("shopzoneUser");

    // Clear Redux cart
    dispatch(clearCart());

    // Clear user from Navbar
    setUser(null);

    // Return to Home
    window.location.href = "/";
  }

  return (
    <header>
      <nav>
        <div className="logo">ShopZone</div>

        <div className="nav-links">
          <a href="/">Home</a>

          <a href="/products">Products</a>

          <a href="/categories">Categories</a>

          <a href="/about">About</a>

          <a href="/contact">Contact</a>

          {user ? (
            <>
              <span>Hi, {user.name}</span>

              <a href="/orders">My Orders</a>

              {user.role === "admin" && (
                <a href="/admin">Admin Dashboard</a>
              )}

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>

              <a href="/register">Register</a>
            </>
          )}

          <a href="/cart">
            Cart 🛒 ({cartCount})
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;