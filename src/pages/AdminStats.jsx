import { useEffect, useState } from "react";

function AdminStats() {
  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load statistics"
        );
      }

      setStats(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load statistics.");
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>
        <p>Only administrators can access this page.</p>

        <button
          onClick={() =>
            (window.location.href = "/")
          }
        >
          Go Home
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="admin-page">
        <h2>ShopZone Statistics</h2>
        <p>Loading statistics...</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>ShopZone Statistics</h2>

      <button
        onClick={() =>
          (window.location.href = "/admin")
        }
      >
        Back to Dashboard
      </button>

      {message && <p>{message}</p>}

      {stats && (
        <div className="admin-dashboard-grid">
          <div className="admin-card">
            <h3>👥 Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="admin-card">
            <h3>📦 Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>

          <div className="admin-card">
            <h3>🛒 Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="admin-card">
            <h3>💰 Total Revenue</h3>
            <p>
              ₹
              {Number(
                stats.totalRevenue
              ).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminStats;