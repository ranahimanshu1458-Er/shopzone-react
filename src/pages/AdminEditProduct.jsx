import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminEditProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    rating: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  const productId =
    window.location.pathname.split("/")[3];

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setMessage("Access denied. Admin only.");
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        const response = await fetch(
          `${API_URL}/api/products/${productId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load product."
          );
        }

        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          rating: data.rating || "",
          image: data.image || "",
          stock: data.stock || "",
        });
      } catch (error) {
        console.error("LOAD PRODUCT ERROR:", error);
        setMessage("Unable to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, user]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    if (!token) {
      setMessage("Please login as an admin.");
      return;
    }

    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.category ||
      !product.image ||
      !product.stock
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: Number(product.price),
            category: product.category,
            rating: Number(product.rating),
            image: product.image,
            stock: Number(product.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update product."
        );
        return;
      }

      setMessage("Product updated successfully.");

      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 1000);
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      setMessage(
        "Unable to connect to the server."
      );
    }
  }

  if (loading) {
    return (
      <section className="admin-page">
        <h2>Edit Product</h2>
        <p>Loading product...</p>
      </section>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>
        <p>Only administrators can edit products.</p>

        <button
          onClick={() =>
            (window.location.href = "/")
          }
        >
          Go Home
        </button>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>Edit Product</h2>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          rows="5"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          min="0"
          max="5"
          value={product.rating}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={product.image}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          min="0"
          value={product.stock}
          onChange={handleChange}
        />

        <button type="submit">
          Update Product
        </button>

        <button
          type="button"
          onClick={() =>
            (window.location.href = "/admin/products")
          }
        >
          Cancel
        </button>
      </form>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}
    </section>
  );
}

export default AdminEditProduct;