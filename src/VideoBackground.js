import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoBackground.css';

const VideoBackground = () => {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLoginButton, setShowLoginButton] = useState(false);
    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [uniqueIdentity, setUniqueIdentity] = useState('');
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSignUp(true);
            setShowLoginButton(true);
        }, 11000); // 0.17 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onended = () => {
                videoRef.current.pause();
            };
        }
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const mobile = formData.get('mobile');
        
        // Validate mobile number
        if (!/^\d{10}$/.test(mobile)) {
            setMessage('Mobile number must be exactly 10 digits');
            return;
        }
    
        const user = {
            name,
            email,
            mobile,
        };
    
        // Add user details to FormData
        formData.append('user', JSON.stringify(user));
    
        try {
            const response = await axios.post('http://localhost:8080/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Check if the response has the unique identity
            if (response.data) {
                setMessage('Register successful');
                setUniqueIdentity(response.data);
                localStorage.setItem('uniqueUsername', response.data); // Store the unique username
                setIsRegistered(true); // Set isRegistered to true
                setShowSignUp(false); // Hide the signup form
            } else {
                setMessage('Username not received from the backend');
            }
        } catch (error) {
            console.error('There was an error submitting the form!', error);
            setMessage('Error submitting form');
        }
    };

    const handleLoginButtonClick = () => {
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="video-background-container">
            <video ref={videoRef} className="background-video" autoPlay muted>
                <source src={`${process.env.PUBLIC_URL}/ii.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {showSignUp && !isRegistered && (
                <div className="signup-overlay">
                    <form className="signup-form" onSubmit={handleFormSubmit}>
                        <h2>Sign Up</h2>
                        <label>
                            Name:
                            <input type="text" name="name" required />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" required />
                        </label>
                        <label>
                            Mobile Number:
                            <input 
                                type="tel" 
                                name="mobile" 
                                pattern="\d{10}" 
                                maxLength="10" 
                                required 
                                placeholder="Enter 10-digit mobile number"
                            />
                        </label>
                        <label>
                            Profile Picture:
                            <input type="file" name="profilePicture" accept="image/*" required />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                    {message && <div className="message">{message}</div>}  {/* Display success/error message */}
                </div>
            )}
            {isRegistered && (
                <div className="success-message-container centered">
                    <h2 className="message">Register successful</h2>
                    <h2 className="unique-identity">{uniqueIdentity}</h2> {/* Apply unique-identity class */}
                </div>
            )}
            {showLoginButton && (
                <div className="login-button-container">
                    <button className="login-button" onClick={handleLoginButtonClick}>
                        Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoBackground;
