import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  return (
    <div className="home-container">
      {/* HOME SECTION DESIGN / HERO SECTION */}
      <section className="home" id="home">
        <div className="home-content">
          <h3>Hi, I'm</h3>
          <h1>Yuan</h1>
          <h3>CCS Student / Aspiring Website Designer</h3>
          <p>
            Welcome to my Web Developer portfolio! I'm Yuan Dec Daz, 
            a Computer Science student who is passionate about building
            responsive and user-friendly websites. I'm currently learning 
            full-stack development to expand my skills and prepare for 
            future job opportunities in the tech industry.
          </p>
          <div className="social-media">
    <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile">
            <FontAwesomeIcon icon={faFacebook} />
    </a>
    <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
            <FontAwesomeIcon icon={faInstagram} />
    </a>
    <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok Profile">
            <FontAwesomeIcon icon={faTiktok} />
    
    </a>
</div>
          <Link to="/contact" className="btn">Get in Touch</Link>
        </div>

        <div className="home-img">
          {/* Ensure your images are in the public/images/ folder */}
          <img src={`${process.env.REACT_APP_BACKEND_URL}/images/MePic.jpg`} alt="Yuan Dec Daz - Computer Science Student and Aspiring Web Developer" />
        </div>
      </section>

      {/* KEY HIGHLIGHTS SECTION */}
      <section className="highlights" id="highlights">
        <h2 className="heading">My <span>Key Skills</span></h2>
        <div className="highlights-content">
          <h3>What I’m Learning & Building</h3>
          <ul className="highlights-list">
            <li>
              <i className="fa-solid fa-code"></i> 
              <strong>Responsive Web Design:</strong> Building mobile-first websites using HTML and CSS that adapt smoothly across phones, tablets, and desktops.
            </li>
            <li>
              <i className="fa-solid fa-palette"></i> 
              <strong>Modern CSS Styling:</strong> Using CSS3, Flexbox, Grid, and basic animations to create clean, user-friendly, and visually consistent layouts.
            </li>
            <li>
              <i className="fa-solid fa-rocket"></i> 
              <strong>Continuous Learner:</strong> Actively learning new tools, frameworks, and best practices through school projects, online resources, and hands-on practice.
            </li>
            <li>
              <i className="fa-solid fa-lightbulb"></i> 
              <strong>Problem Solving:</strong> Applying logical thinking and creativity to debug code, complete programming tasks, and improve project functionality.
            </li>
          </ul>
        </div>
      </section>

      {/* PREVIEW SECTION 1: ABOUT ME */}
      <section className="preview about-preview" id="about-preview">
        <div className="about-img">
          <img src={`${process.env.REACT_APP_BACKEND_URL}/images/Lean.jpg`} alt="Yuan Dec Daz" />
        </div>

        <div className="about-content">
          <h2 className="heading">About <span>Me</span></h2>
          <h3>CCS Student / Aspiring Website Designer</h3>
          <p>
            Hi! I'm Yuan Dec Daz, a 20-year-old third-year Computer Science student at DMMMSU-SLUC 
            with a strong desire to achieve a financially stable future. I'm passionate about 
            becoming a full-stack developer, as I believe it will open better opportunities 
            for my career.
          </p>
          <p>
             I enjoy spending my free time playing online games. My favorite color is blue, 
             and I'm a huge fan of both dogs and cats. I consider myself a "jack of all trades, 
             master of none"—I know a little about many things, but I'm constantly working to 
             improve my skills and turn knowledge into mastery.
            </p>
          <Link to="/about" className="btn">Read More</Link>
        </div>
      </section>

      {/* PREVIEW SECTION 2: CONTACT */}
      <section className="preview contact-preview" id="contact-preview">
        <h2 className="heading">Get In <span>Touch</span></h2>
        <div className="contact-preview-content">
          <p>
            Have a project in mind or want to collaborate? Feel free to reach out through my contact form or connect with me on social media.
          </p>
          <div className="contact-info">
            <div className="info-item">
              <i className="fa-solid fa-envelope"></i>
              <span>yudecodes@example.com</span>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-phone"></i>
              <span>+63 987 345 6789</span>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-location-dot"></i>
              <span>La Union, Philippines</span>
            </div>
          </div>
          <Link to="/contact" className="btn">Contact Me</Link>
        </div>
      </section>

      {/* PREVIEW SECTION 3: REGISTER */}
      <section className="preview register-preview" id="register-preview">
        <h2 className="heading">Stay <span>Connected</span></h2>
        <div className="register-preview-content">
          <p>
            Want to follow my web development journey and get updates on my latest projects? 
            Sign up for my newsletter to receive exclusive content, coding tips, and insights 
            into the world of full-stack development. Join a community of fellow tech enthusiasts!
          </p>  
          <div className="register-benefits">
            <div className="benefit-item">
              <i className="fa-solid fa-newspaper"></i>
              <h4>Monthly Newsletter</h4>
              <p>Get updates on my projects and web dev tips</p>
            </div>
            <div className="benefit-item">
              <i className="fa-solid fa-code-branch"></i>
              <h4>Project Insights</h4>
              <p>Behind-the-scenes look at my coding process</p>
            </div>
            <div className="benefit-item">
              <i className="fa-solid fa-users"></i>
              <h4>Community Access</h4>
              <p>Connect with other aspiring developers</p>
            </div>
          </div>
          <Link to="/register" className="btn">Sign Up Now</Link>
        </div>
      </section>
    </div>
  );
}
