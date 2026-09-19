import { useState } from "react";
import { API_URL } from "../config";

function AdminAddProduct() {
  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [rating, setRating] = useState("5");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState("");

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
       `${API_URL}/api/products` ,
        {
          method: "POST",
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
          data.message || "Failed to add product."
        );
        return;
      }

      setMessage("Product added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Electronics");
      setRating("5");
      setImage("");
      setStock("");
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

  return (
    <section className="admin-page">
      <h2>Add New Product</h2>

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
          placeholder="Image path, e.g. /laptop.jpg"
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
          Add Product
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

export default AdminAddProduct;