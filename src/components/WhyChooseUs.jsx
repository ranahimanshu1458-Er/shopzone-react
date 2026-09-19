function WhyChooseUs() {
  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Get your products delivered quickly."
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "Your payments are safe and secure."
    },
    {
      icon: "⭐",
      title: "Quality Products",
      description: "We provide high-quality products."
    },
    {
      icon: "📞",
      title: "Customer Support",
      description: "Our support team is always ready to help."
    }
  ];

  return (
    <section className="why-choose-us">

      <h2>Why Choose ShopZone?</h2>

      <div className="features-grid">

        {features.map((feature) => (
          <div className="feature-card" key={feature.title}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default WhyChooseUs;