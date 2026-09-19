function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("shopzoneUser"));

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>
        <p>Only administrators can access this page.</p>

        <button onClick={() => (window.location.href = "/")}>
          Go Home
        </button>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>Admin Dashboard</h2>

      <p>
        Welcome, <strong>{user.name}</strong>!
      </p>

      <div className="admin-dashboard-grid">
        {/* PRODUCTS */}
        <div className="admin-card">
          <h3>📦 Products</h3>
          <p>Manage ShopZone products.</p>

          <button
            onClick={() =>
              (window.location.href = "/admin/products")
            }
          >
            Manage Products
          </button>
        </div>

        {/* ORDERS */}
        <div className="admin-card">
          <h3>🛒 Orders</h3>
          <p>View and manage customer orders.</p>

          <button
            onClick={() =>
              (window.location.href = "/admin/orders")
            }
          >
            Manage Orders
          </button>
        </div>

        {/* USERS */}
        <div className="admin-card">
          <h3>👥 Users</h3>
          <p>View registered customers.</p>

          <button
            onClick={() =>
              (window.location.href = "/admin/users")
            }
          >
            Manage Users
          </button>
        </div>

        {/* STATISTICS */}
        <div className="admin-card">
          <h3>📊 Dashboard</h3>
          <p>View ShopZone statistics.</p>

          <button
            onClick={() =>
              (window.location.href = "/admin/stats")
            }
          >
            View Statistics
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;