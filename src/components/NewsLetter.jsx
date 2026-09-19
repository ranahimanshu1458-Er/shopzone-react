import { useState } from "react";

function Newsletter() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (email.trim() === "") {
      setMessage("Please enter your email.");
      return;
    }

    setMessage("Thank you for subscribing!");

    setEmail("");
  }

  return (
    <section className="newsletter">

      <h2>Subscribe to Our Newsletter</h2>

      <p>
        Get the latest products, offers and updates.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button type="submit">
          Subscribe
        </button>

      </form>

      {message && (
        <p className="newsletter-message">
          {message}
        </p>
      )}

    </section>
  );
}

export default Newsletter;