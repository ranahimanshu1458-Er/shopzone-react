import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/products")
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