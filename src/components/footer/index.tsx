import './footer.css';
import { FaInstagram } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";


export function Footer() {
    return(
        <div className="footer-container">
            <footer>
                <div className='footer-text'>
                    <p> Developed by <a href="https://instagram.com/https.luisedu77" target='blank'>@https.luisedu77</a></p>
                </div>
                <div className='footer-social'>
                    <a href="https://instagram.com/https.luisedu77" target='blank'>
                        <FaInstagram className='social-media'/>
                    </a>
                    <a href="https://github.com/luiscarlosedu" target='blank'>
                        <FiGithub className='social-media'/>
                    </a>
                    <a href="https://www.linkedin.com/in/lu%C3%ADs-eduardo-ferreira-carlos-4800872a5/" target='blank'>
                        <FaLinkedin className='social-media'/>
                    </a>
                </div>
            </footer>
        </div>
    )
}
