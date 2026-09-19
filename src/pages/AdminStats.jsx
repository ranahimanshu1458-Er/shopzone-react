import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setMessage("Access denied. Admin only.");
      setLoading(false);
      return;
    }

    async function loadStats() {
      try {
        const response = await fetch(
          `${API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load statistics."
          );
        }

        setStats(data);
      } catch (error) {
        console.error(
          "LOAD STATISTICS ERROR:",
          error
        );

        setMessage(
          "Unable to load statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [token, user]);

  if (loading) {
    return (
      <section className="admin-page">
        <h2>ShopZone Statistics</h2>
        <p>Loading statistics...</p>
      </section>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>

        <p>
          Only administrators can view statistics.
        </p>

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

  return (
    <section className="admin-page">
      <h2>ShopZone Statistics</h2>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

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

      <button
        onClick={() =>
          (window.location.href = "/admin")
        }
      >
        Back to Dashboard
      </button>
    </section>
  );
}

export default AdminStats;