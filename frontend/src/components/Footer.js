import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-text">
        <p>Copyright &copy; 2026 by @yudecodes | All Rights Reserved.</p>
        <p className="contact-info-footer">
          Email: yuan.daz@example.com | Phone: +63 912 345 6789
        </p>
      </div>

      <div className="footer-iconTop">
        <a href="#home">
          {/* Use the component and pass the icon variable */}
          <FontAwesomeIcon icon={faArrowUp} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;