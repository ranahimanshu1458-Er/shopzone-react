import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { API_URL } from "../config";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Failed to load featured products:", error);
      });
  }, []);

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              ...product,
              id: product._id,
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;