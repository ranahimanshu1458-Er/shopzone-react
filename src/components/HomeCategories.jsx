function HomeCategories() {
  const categories = [
    {
      name: "Electronics",
      description: "Latest gadgets and electronic products",
      image: "/electronics.jpg",
    },
    {
      name: "Fashion",
      description: "Trendy clothing and fashion products",
      image: "/fashion.jpg",
    },
    {
      name: "Home & Living",
      description: "Everything you need for your home",
      image: "/home.jpg",
    },
    {
      name: "Sports",
      description: "Sports equipment and accessories",
      image: "/sports.webp",
    },
  ];

  function handleViewProducts(category) {
    window.location.href = `/categories?category=${encodeURIComponent(
      category
    )}`;
  }

  return (
    <section className="categories-section">
      <h2>Shop by Category</h2>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.name}>
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />

            <h3>{category.name}</h3>

            <p>{category.description}</p>

            <button
              onClick={() =>
                handleViewProducts(category.name)
              }
            >
              View Products
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeCategories;