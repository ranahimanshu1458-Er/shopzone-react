import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

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
        id: product._id || product.id,
      })
    );
  }

  function handleViewDetails() {
    window.location.href = `/products/${
      product._id || product.id
    }`;
  }

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        onClick={handleViewDetails}
        style={{ cursor: "pointer" }}
      />

      <h3
        onClick={handleViewDetails}
        style={{ cursor: "pointer" }}
      >
        {product.name}
      </h3>

      <p>{product.description}</p>

      <div className="rating">
        {"⭐".repeat(product.rating)}
      </div>

      <h4>
        ₹{product.price.toLocaleString("en-IN")}
      </h4>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;