import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Navbar.css';

function Navbar({ onAboutClick }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="nav-container">
      <motion.div
        className="logo-container"
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: '0%' }}
        transition={{ delay: 1, type: 'spring', stiffness: 80 }}
      >
        <motion.div
          className="logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <img src="yas.png" alt="Last APP Logo" className="logo-img" />
        </motion.div>
        <motion.div
          className="logo-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          
        </motion.div>
      </motion.div>
      <motion.div
        className="nav-buttons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="nav-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAboutClick}  // Trigger the function passed via props
        >
          <span className="button-txt">ABOUT</span>
        </motion.div>
        
        <motion.div
          className="nav-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="button-txt">SERVICES</span>
        </motion.div>
        
        <motion.div
          className="nav-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="button-txt">PRIVACY</span>
        </motion.div>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/terminator" className="dropdown-item">Terminator Page</Link>
          </motion.div>
        )}
      </motion.div>
    </nav>
  );
}

export default Navbar;
