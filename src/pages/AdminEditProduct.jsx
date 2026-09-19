import { useEffect, useState } from "react";

function AdminEditProduct() {
  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  const productId = window.location.pathname.split("/")[4];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [rating, setRating] = useState("5");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/products/${productId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Product not found"
        );
      }

      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setCategory(data.category);
      setRating(data.rating);
      setImage(data.image);
      setStock(data.stock);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load product.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !image ||
      !stock
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            price: Number(price),
            category,
            rating: Number(rating),
            image,
            stock: Number(stock),
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

      setMessage("Product updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
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
        <h2>Edit Product</h2>
        <p>Loading product...</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>Edit Product</h2>

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        <textarea
          placeholder="Product Description"
          rows="4"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(event) =>
            setPrice(event.target.value)
          }
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option value="Electronics">
            Electronics
          </option>

          <option value="Fashion">
            Fashion
          </option>

          <option value="Home & Living">
            Home & Living
          </option>

          <option value="Sports">
            Sports
          </option>
        </select>

        <select
          value={rating}
          onChange={(event) =>
            setRating(event.target.value)
          }
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <input
          type="text"
          placeholder="Image path"
          value={image}
          onChange={(event) =>
            setImage(event.target.value)
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(event) =>
            setStock(event.target.value)
          }
        />

        <button type="submit">
          Save Changes
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

      {message && <p>{message}</p>}
    </section>
  );
}

export default AdminEditProduct;