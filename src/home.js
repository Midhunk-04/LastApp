import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import Typical from 'react-typical';
import './home.css';
import Navbar from './Navbar';
import './Navbar.css';
import TerminatorPage from './TerminatorPage'; // Import the TerminatorPage component

// PopupTerminator component
const PopupTerminator = ({ onClose }) => (
  <div className="popup-overlay">
    <div className="popup-container">
      <div className="close-button" onClick={onClose}>×</div>
      <h2>Terminator Page</h2>
      <p>This is the content for the Terminator page, shown in a popup.</p>
      {/* Add any additional content or styling for your Terminator page */}
    </div>
  </div>
);

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Manage popup visibility
  const blackSectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const showAbout = () => {
    setActiveSection('about');
    blackSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const showTerminatorPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home">
      <Navbar onAboutClick={showAbout} />

      <div className="initial-section">
        <div className="background-video">
          <video autoPlay muted loop>
            <source src="m.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="website-name">
          <h1>LAST APP</h1>
        </div>

        {/* Circle buttons below the title */}
        <motion.div 
          className="button-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="circle-button" onClick={showTerminatorPopup}>Terminator</div>
          <div className="circle-button">Privacy</div>
          <div className="circle-button">Security</div>
        </motion.div>
      </div>

      <div
        ref={blackSectionRef}
        className={`black-section ${activeSection === 'about' ? '' : 'hidden'}`}
      >
        <img src="/back.png" alt="Background" className="black-section-image" />
        <div className="content">
          <h2>Our Vision</h2>
          <Typical
            steps={[
              'The Post-Mortem Digital Privacy Protector ensures the privacy and security of your digital footprint after your passing.',
              2000, // Delay between sentences
              'In a world where personal data on social media and apps is a major concern, our app provides a secure, automated solution to manage and delete selected digital data upon death.',
              2000 // Delay between sentences
            ]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
      </div>

      {/* Render TerminatorPage as a popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="close-button" onClick={closePopup}>×</div>
            <TerminatorPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
