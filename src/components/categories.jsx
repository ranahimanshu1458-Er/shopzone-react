import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Electronics");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Sports",
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

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

      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
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