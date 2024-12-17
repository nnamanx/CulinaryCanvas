import "./ContactPage.css"

const ContactPage = () => {

  return (
    <div className="contact-page">
      
      <form class="contact-form" action="" method="POST">
        <h2>Contact Us</h2>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name" required />

        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Your email" required />

        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Your message" required ></textarea>

        <button type="submit">Send Message</button>
      </form>
      
    </div>
  );
};

export default ContactPage;
