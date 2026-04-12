import React, { useState } from 'react';
import API from '../api/axios';


export default function Contact() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullname) tempErrors.fullname = "Full name is required";
    if (!formData.email.includes("@")) tempErrors.email = "Valid email is required";
    if (formData.message.length < 10) tempErrors.message = "Message must be at least 10 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await API.post('/contact', {
          name: formData.fullname,
          email: formData.email,
          message: formData.message,
        });
        alert("Message sent successfully! Thank you for contacting us, " + formData.fullname + "!");
        // Clear the form
        setFormData({ fullname: '', email: '', message: '' });
      } catch (error) {
        alert("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="contact-page">
      <section className="contact" id="contact">
        <h2 className="heading">Contact <span>Me</span></h2>
        <p className="contact-description">
            I'd love to hear from you! Whether you have a question, project idea, or just want to connect, 
            feel free to reach out using the form below.
        </p>

        <form onSubmit={handleSend}>
          <div className="input-box">
            <div className="input-field">
              <input 
                type="text" 
                placeholder="Full Name"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
              />
              {errors.fullname && <span className="error">{errors.fullname}</span>}
            </div>
            
            <div className="input-field">
              <input 
                type="email" 
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>

          <textarea 
            rows="10" 
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
          {errors.message && <span className="error">{errors.message}</span>}
          
          <button type="submit" className="btn">Send Message</button>
        </form>
      </section>

      {/* RESOURCES TABLE */}
      <section className="resources-section">
        <h2 className="heading">Helpful <span>Resources</span></h2>
        <div className="resources-table">
          <table>
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="https://developer.mozilla.org/" target="_blank" rel="noreferrer">MDN Web Docs</a></td>
                <td>Comprehensive documentation for HTML, CSS, and JS.</td>
              </tr>
              <tr>
                <td><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a></td>
                <td>Essential platform for version control and collaboration.</td>
              </tr>
              <tr>
                <td><a href="https://www.freecodecamp.org/" target="_blank" rel="noreferrer">freeCodeCamp</a></td>
                <td>Free interactive coding tutorials and certifications that helped me build my foundation in web development</td>
              </tr>
              <tr>
                <td><a href="https://css-tricks.com/" target="_blank" rel="noreferrer">CSS-Tricks</a></td>
                <td>Amazing resource for CSS techniques, tips, and best practices for creating beautiful designs</td>
             </tr>
             <tr>
                <td><a href="https://stackoverflow.com/" target="_blank" rel="noreferrer">Stack Overflow</a></td>
                <td>Massive community of developers helping each other solve coding problems - a lifesaver when debugging</td>
            </tr>

            </tbody>
          </table>
        </div>
      </section>

      {/* MAP SECTION - FIXED IFRAME */}
        <section className="map-section-wrapper">
        <div className="map-section">
            <h3>Find Me Here</h3>
            <p>
                Based in Bauang, La Union, Philippines - Available for remote opportunities nationwide
            </p>
            <div className="map-container">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245281.77013604056!2d121.72899999999999!3d17.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3385a7c7fe862b87%3A0xae89ede7e79a8d2e!2sBauang%20%2C%20LaUnion%20%2C%20Philippines!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph" 
                    width="100%" 
                    height="450" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Map showing La Union, Philippines location">
                </iframe>
            </div>
        </div>
    </section>

      {/* LINK CARDS */}
       <section className="external-links-wrapper">
        <div className="external-links">
            <h3>Learn More About Web Development</h3>
            <div className="links-grid">
                <div className="link-card">
                    <i class="fa-brands fa-google"></i>
                    <h4>Google Web Fundamentals</h4>
                    <p>Best practices for modern web development from Google's expert team</p>
                    <a href="https://developers.google.com/web" target="_blank" rel="noreferrer" >Visit Site →</a>
                </div>
                <div class="link-card">
                    <i class="fa-brands fa-youtube"></i>
                    <h4>Traversy Media</h4>
                    <p>Excellent YouTube channel with practical web development tutorials and crash courses</p>
                    <a href="https://www.youtube.com/@TraversyMedia" target="_blank" rel="noreferrer">Visit Channel →</a>
                </div>
                <div class="link-card">
                    <i class="fa-solid fa-code"></i>
                    <h4>W3Schools</h4>
                    <p>Beginner-friendly tutorials and references for web development languages and frameworks</p>
                    <a href="https://www.w3schools.com/" target="_blank" rel="noreferrer">Visit Site →</a>
                </div>
            </div>
        </div>
    </section>

    </div>
  );
}