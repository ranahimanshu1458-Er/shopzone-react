import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const productId = window.location.pathname.split("/")[2];

    fetch(`http://127.0.0.1:5001/api/products/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load product.");
        setLoading(false);
      });
  }, []);

  function handleAddToCart() {
    const token = localStorage.getItem("shopzoneToken");

    if (!token) {
      alert("Please login before adding products to your cart.");
      window.location.href = "/login";
      return;
    }

    dispatch(
      addToCart({
        ...product,
        id: product._id,
      })
    );
  }

  if (loading) {
    return (
      <section className="product-details-page">
        <p>Loading product...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-details-page">
        <h2>{error}</h2>

        <button
          onClick={() => (window.location.href = "/products")}
        >
          Back to Products
        </button>
      </section>
    );
  }

  return (
    <section className="product-details-page">
      <div className="product-details-card">
        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">
          <h2>{product.name}</h2>

          <div className="rating">
            {"⭐".repeat(product.rating)}
          </div>

          <h3>
            ₹{product.price.toLocaleString("en-IN")}
          </h3>

          <p>{product.description}</p>

          <p>
            <strong>Category:</strong>{" "}
            {product.category}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {product.stock}
          </p>

          <button onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button
            onClick={() =>
              (window.location.href = "/products")
            }
          >
            Back to Products
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;