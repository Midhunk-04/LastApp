import axios from 'axios';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';


// Animations
const flickerAnimation = keyframes`
  0% { opacity: 1; }
  10% { opacity: 0.6; }
  20% { opacity: 1; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 2px #00FFFF, 0 0 4px #00FFFF, 0 0 8px #00FFFF, 0 0 16px #00FFFF; }
  50% { box-shadow: 0 0 4px #FF4500, 0 0 8px #FF4500, 0 0 16px #FF4500, 0 0 32px #FF4500; }
  100% { box-shadow: 0 0 2px #00FFFF, 0 0 4px #00FFFF, 0 0 8px #00FFFF, 0 0 16px #00FFFF; }
`;

const zoomInAnimation = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: black;
  color: #00FFFF;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  overflow: hidden;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  border: 2px solid #FF4500;
  padding: 10px;
  margin-top: 20px;
  animation: ${glowAnimation} 1.5s infinite;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #00FFFF;
  font-size: 24px;
  font-family: 'Orbitron', sans-serif;
  caret-color: #FF4500;
  width: 250px;
  &::placeholder {
    color: #00FFFF;
    opacity: 0.8;
  }
`;

const Label = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  animation: ${flickerAnimation} 1.5s infinite;
  text-shadow: 0 0 2px #00FFFF, 0 0 4px #00FFFF;
  font-family: 'Orbitron', sans-serif;
`;

const ErrorMessage = styled.div`
  color: #00FF00;
  font-size: 18px;
  margin-top: 10px;
`;

const AccessGrantedMessage = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: #00FF00;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 0 0 2px #00FF00, 0 0 4px #00FF00;
  text-align: center;
  animation: ${props => props.zoomIn ? zoomInAnimation : 'none'} 2s forwards;
`;

const AccessDeniedMessage = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: #FF0000;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 0 0 2px #FF0000, 0 0 4px #FF0000;
`;

const FullscreenVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 10;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border: 3px solid #00FFFF;
  margin-top: 20px;
  animation: ${props => props.zoomIn ? zoomInAnimation : 'none'} 4s forwards;
`;

const WelcomeMessage = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: #FF4500;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 0 0 2px #FF4500, 0 0 4px #FF4500;
  text-align: center;
  animation: ${props => props.zoomIn ? zoomInAnimation : 'none'} 4s forwards;
`;

// Component
const Login = () => {
  const [username, setUsername] = useState('');
  const [accessGranted, setAccessGranted] = useState(null); // null, true, or false
  const [zoomIn, setZoomIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const typingSoundRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isPlayingRef = useRef(false);
  const videoRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (accessGranted === true) {
      setTimeout(() => {
        setZoomIn(true);
        setTimeout(() => {
          setAccessGranted('WELCOME');
        }, 2000);
      }, 1000);
    }
  }, [accessGranted]);

  useEffect(() => {
    if (accessGranted === 'WELCOME') {
      setTimeout(() => {
        setAccessGranted('VIDEO');
      }, 2000);
    }
  }, [accessGranted]);

  const handleVideoEnd = () => {
    navigate('/home'); // Redirect to Home page after video ends
  };

  useEffect(() => {
    if (accessGranted === 'VIDEO' && videoRef.current) {
      gsap.fromTo(videoRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            videoRef.current.addEventListener('ended', handleVideoEnd); // Add event listener
          }
        }
      );
    }
  }, [accessGranted]);

  const playTypingSound = () => {
    if (typingSoundRef.current && !isPlayingRef.current) {
      typingSoundRef.current.currentTime = 0;
      typingSoundRef.current.play().catch((error) => console.log('Play interrupted', error));
      isPlayingRef.current = true;
    }
  };

  const stopTypingSound = () => {
    if (typingSoundRef.current && isPlayingRef.current) {
      typingSoundRef.current.pause();
      typingSoundRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  };

  const handleTypingStart = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    playTypingSound();
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTypingSound();
    }, 500);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLogin = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('http://localhost:8080/login', { username }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.name) {
          setAccessGranted(true);
          setUserData(response.data); // Store user data
        } else {
          setAccessGranted(false);
        }
      } catch (error) {
        console.error('Error during login!', error);
        setError('Login failed. Please try again.');
        setAccessGranted(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      {loading && <div>Loading...</div>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {accessGranted === true && (
        <>
          <AccessGrantedMessage zoomIn={zoomIn}>ACCESS GRANTED</AccessGrantedMessage>
        </>
      )}
      {accessGranted === 'WELCOME' && userData && (
        <>
          <WelcomeMessage zoomIn={zoomIn}>Hello, {userData.name}</WelcomeMessage>
          <ProfilePicture
            src={`http://localhost:8080/uploads/${userData.profilePicture}`}
            alt="Profile"
            zoomIn={zoomIn}
          />
        </>
      )}
      {accessGranted === 'VIDEO' && (
        <FullscreenVideo
          ref={videoRef}
          src="ui 6.mp4"
          autoPlay
          muted
          onEnded={handleVideoEnd} // Added onEnded event
          show={accessGranted === 'VIDEO'}
        />
      )}
      <div>
        {accessGranted === null ? (
          <>
            <Label>PLEASE IDENTIFY YOURSELF</Label>
            <InputWrapper>
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={handleLogin}
                placeholder="Enter username..."
                onFocus={handleTypingStart}
                onBlur={handleTypingStop}
              />
            </InputWrapper>
          </>
        ) : (
          !accessGranted && (
            <AccessDeniedMessage>ACCESS DENIED</AccessDeniedMessage>
          )
        )}
      </div>
      <audio ref={typingSoundRef}>
        <source src="typing-sound.mp3" type="audio/mpeg" />
      </audio>
    </Container>
  );
};

export default Login;
