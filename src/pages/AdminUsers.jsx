import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminUsers() {
  const [users, setUsers] = useState([]);
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

    async function loadUsers() {
      try {
        const response = await fetch(
          `${API_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load users."
          );
        }

        setUsers(data);
      } catch (error) {
        console.error("LOAD USERS ERROR:", error);
        setMessage("Unable to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [token, user]);

  async function updateUserRole(userId, role) {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update user role."
        );
      }

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser._id === userId
            ? {
                ...currentUser,
                role: data.user.role,
              }
            : currentUser
        )
      );

      setMessage("User role updated successfully.");
    } catch (error) {
      console.error(
        "UPDATE USER ROLE ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Unable to update user role."
      );
    }
  }

  if (loading) {
    return (
      <section className="admin-page">
        <h2>Manage Users</h2>
        <p>Loading users...</p>
      </section>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>

        <p>
          Only administrators can manage users.
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
      <h2>Manage Users</h2>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="admin-users-list">
          {users.map((currentUser) => (
            <div
              className="admin-user-card"
              key={currentUser._id}
            >
              <h3>{currentUser.name}</h3>

              <p>
                <strong>Email:</strong>{" "}
                {currentUser.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {currentUser.role}
              </p>

              <p>
                <strong>Registered:</strong>{" "}
                {new Date(
                  currentUser.createdAt
                ).toLocaleDateString("en-IN")}
              </p>

              <label>
                <strong>Change Role:</strong>{" "}
              </label>

              <select
                value={currentUser.role}
                onChange={(event) =>
                  updateUserRole(
                    currentUser._id,
                    event.target.value
                  )
                }
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>
          ))}
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

export default AdminUsers;