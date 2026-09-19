import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      setProducts(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete product.");
        return;
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );

      setMessage("Product deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete product.");
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>
        <p>Only administrators can access this page.</p>

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
        <h2>Manage Products</h2>
        <p>Loading products...</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>Manage Products</h2>

      <button
        onClick={() =>
          (window.location.href = "/admin/products/add")
        }
      >
        ➕ Add Product
      </button>

      <button
        onClick={() =>
          (window.location.href = "/admin")
        }
      >
        Back to Dashboard
      </button>

      {message && <p>{message}</p>}

      <div className="admin-products-list">
        {products.map((product) => (
          <div
            className="admin-product-card"
            key={product._id}
          >
            <img
              src={product.image}
              alt={product.name}
            />

            <div>
              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <p>
                <strong>Price:</strong>{" "}
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {product.category}
              </p>

              <p>
                <strong>Stock:</strong>{" "}
                {product.stock}
              </p>

              <p>
                <strong>Rating:</strong>{" "}
                {"⭐".repeat(product.rating)}
              </p>

              <button
                onClick={() =>
                  (window.location.href =
                    `/admin/products/edit/${product._id}`)
                }
              >
                ✏️ Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(product._id)
                }
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminProducts;