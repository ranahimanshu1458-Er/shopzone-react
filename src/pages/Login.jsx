import { useState } from "react";
import { API_URL } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("shopzoneToken", data.token);
      localStorage.setItem(
        "shopzoneUser",
        JSON.stringify(data.user)
      );

      setMessage(`Welcome, ${data.user.name}!`);

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <button type="submit">
            Login
          </button>
        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() =>
              (window.location.href = "/register")
            }
          >
            Register
          </button>
        </p>
      </div>
    </section>
  );
}

export default Login;