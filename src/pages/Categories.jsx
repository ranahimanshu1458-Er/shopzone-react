import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Electronics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Sports",
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(
          "fetch(`${API_URL}/api/products`)"
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("CATEGORY PRODUCTS ERROR:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!product.category) {
      return false;
    }

    return (
      product.category.trim().toLowerCase() ===
      selectedCategory.trim().toLowerCase()
    );
  });

  return (
    <section className="products-page">
      <h2>Shop by Category</h2>

      <div className="category-filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "active-category"
                : ""
            }
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <p className="category-message">
          Loading products...
        </p>
      )}

      {!loading && error && (
        <p className="category-message">
          {error}
        </p>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="category-message">
          <h3>No products available</h3>
          <p>
            There are currently no products available in the{" "}
            <strong>{selectedCategory}</strong> category.
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                id: product._id,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoriesPage;