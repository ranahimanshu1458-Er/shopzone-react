function Contact() {
  return (
    <section className="contact-page">
      <h2>Contact Us</h2>

      <p>
        Have any questions or need help? We would love to hear from you.
      </p>

      <div className="contact-info">
        <p><strong>Email:</strong> support@shopzone.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Address:</strong> Patna, Bihar, India</p>
      </div>

      <form className="contact-form">
        <input
          type="text"
          placeholder="Your Name"
        />

        <input
          type="email"
          placeholder="Your Email"
        />

        <textarea
          placeholder="Your Message"
          rows="5"
        ></textarea>

        <button type="submit">
          Send Message
        </button>
      </form>
    </section>
  );
}

export default Contact;