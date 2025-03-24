
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-charcoalSecondary border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <i className="fa-solid fa-chart-line text-cyan text-xl"></i>
              <h3 className="text-cyan text-xl ml-2 font-semibold">BestAlgo.ai</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Advanced algorithmic trading platform for the Indian market.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 border-b border-cyan/30 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-cyan transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-cyan transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/strategy-selection" className="text-gray-300 hover:text-cyan transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Strategies
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 border-b border-cyan/30 pb-2 inline-block">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-cyan transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-cyan transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-cyan transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 border-b border-cyan/30 pb-2 inline-block">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-300 group">
                <Mail size={16} className="text-cyan" />
                <a href="mailto:enquiry@infocap.info" className="hover:text-cyan transition-colors">enquiry@infocap.info</a>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="text-cyan" />
                <span>Madurai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-cyan" />
                <a href="tel:+919600898633" className="hover:text-cyan transition-colors">+91 9600 898 633</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50">
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
