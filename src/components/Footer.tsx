
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

const EXTERNAL_BLOG_URL = 'https://infocapinfo.blogspot.com/';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">BestAlgo.ai</h3>
            <p className="text-gray-400 text-sm mb-4">
              Advanced algorithmic trading platform for the Indian market.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF00D4]">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF00D4]">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF00D4]">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#FF00D4] text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-[#FF00D4] text-sm">Pricing</Link>
              </li>
              <li>
                <Link to="/strategy-selection" className="text-gray-400 hover:text-[#FF00D4] text-sm">Strategies</Link>
              </li>
              <li>
                <a 
                  href={EXTERNAL_BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#FF00D4] text-sm flex items-center"
                >
                  Blog
                  <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[#FF00D4] text-sm">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[#FF00D4] text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-[#FF00D4] text-sm">Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={16} />
                <a href="mailto:support@bestalgo.ai" className="hover:text-[#FF00D4]">support@bestalgo.ai</a>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin size={16} />
                <span>Madurai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={16} />
                <span>+91 XXXXX XXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} BestAlgo.ai. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2 md:mt-0">
              A Product of Infocap Securities Private Limited
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
