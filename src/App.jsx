import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import WhyChooseUs from "./components/WhyChooseUs";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

import Cart from "./pages/Cart";
import Products from "./pages/Products";
import CategoriesPage from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminStats from "./pages/AdminStats";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname
  );

  function handleNavigation() {
    setCurrentPage(window.location.pathname);
  }

  window.onpopstate = handleNavigation;

  return (
    <>
      <Navbar />

      <main>
        {currentPage.startsWith("/products/") ? (
          <ProductDetails />
        ) : currentPage.startsWith(
            "/admin/products/edit/"
          ) ? (
          <AdminEditProduct />
        ) : currentPage === "/admin/products/add" ? (
          <AdminAddProduct />
        ) : currentPage === "/admin/products" ? (
          <AdminProducts />
        ) : currentPage === "/admin/orders" ? (
          <AdminOrders />
          ) : currentPage === "/admin/users" ? (
  <AdminUsers />
  ) : currentPage === "/admin/stats" ? (
  <AdminStats />
        ) : currentPage === "/admin" ? (
          <AdminDashboard />
        ) : currentPage === "/checkout" ? (
          <Checkout />
        ) : currentPage === "/orders" ? (
          <MyOrders />
        ) : currentPage === "/cart" ? (
          <Cart />
        ) : currentPage === "/products" ? (
          <Products />
        ) : currentPage === "/categories" ? (
          <CategoriesPage />
        ) : currentPage === "/about" ? (
          <About />
        ) : currentPage === "/contact" ? (
          <Contact />
        ) : currentPage === "/login" ? (
          <Login />
        ) : currentPage === "/register" ? (
          <Register />
        ) : (
          <>
            <Hero />
            <Categories />
            <FeaturedProducts />
            <WhyChooseUs />
            <Newsletter />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;