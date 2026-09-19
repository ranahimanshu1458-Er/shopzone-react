import { useEffect, useState } from "react";

function AdminUsers() {
  const user = JSON.parse(
    localStorage.getItem("shopzoneUser")
  );

  const token = localStorage.getItem("shopzoneToken");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/admin/users/${userId}/role`,
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
        setMessage(
          data.message || "Failed to update role."
        );
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
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
      console.error(error);
      setMessage("Unable to update user role.");
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="admin-page">
        <h2>Access Denied</h2>

        <p>
          Only administrators can access this page.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="admin-page">
        <h2>Manage Users</h2>

        <p>Loading users...</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h2>Manage Users</h2>

      <button
        onClick={() =>
          (window.location.href = "/admin")
        }
      >
        Back to Dashboard
      </button>

      {message && <p>{message}</p>}

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
                <strong>Change Role:</strong>
              </label>

              <select
                value={currentUser.role}
                onChange={(event) =>
                  handleRoleChange(
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
    </section>
  );
}

export default AdminUsers;