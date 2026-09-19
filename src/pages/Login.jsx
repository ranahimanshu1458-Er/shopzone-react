import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

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
}, 500);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }
  }

  return (
    <section className="login-page">
      <h2>Login to ShopZone</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          Login
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}

export default Login;