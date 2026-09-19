import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [maxPrice, setMaxPrice] = useState("");


  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

 const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || product.category === category;

  const matchesPrice =
    maxPrice === "" || product.price <= Number(maxPrice);

  return matchesSearch && matchesCategory && matchesPrice;
});

  if (loading) {
    return (
      <section className="products-page">
        <h2>Products</h2>
        <p>Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-page">
        <h2>Products</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="products-page">
      <h2>All Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="product-search"
      />

      <select
  value={category}
  onChange={(event) => setCategory(event.target.value)}
  className="product-category-filter"
>
  <option value="All">All Categories</option>
  <option value="Electronics">Electronics</option>
  <option value="Fashion">Fashion</option>
  <option value="Home & Living">Home & Living</option>
  <option value="Sports">Sports</option>
</select>
<input
  type="number"
  placeholder="Maximum price"
  value={maxPrice}
  onChange={(event) => setMaxPrice(event.target.value)}
  className="product-price-filter"
/><button
  onClick={() => {
    setSearch("");
    setCategory("All");
    setMaxPrice("");
  }}
  className="clear-filters"
>
  Clear Filters
</button>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
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

export default Products;