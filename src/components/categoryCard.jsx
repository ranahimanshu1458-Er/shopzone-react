function CategoryCard({ name, description, image }) {
  return (
    <div className="category-card">

      <img
        src={image}
        alt={name}
        className="category-image"
      />

      <h3>{name}</h3>

      <p>{description}</p>

      <button>
        View Products
      </button>

    </div>
  );
}

export default CategoryCard;