import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './TerminatorPage.css'; // Import the CSS file for specific styles

// Define the deleteFile function
const deleteFile = async (filePath) => {
  try {
    const response = await axios.delete('http://localhost:5000/delete-file', {
      data: { filePath }
    });
    console.log(response.data.message);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

const TerminatorPage = () => {
  const [selectedItems, setSelectedItems] = useState({ apps: [], files: [] });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [deleteTimeoutId, setDeleteTimeoutId] = useState(null);
  const timerRef = useRef(timer);
  const yesButtonRef = useRef(null); // Ref for the "Yes" button

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    if (timerRunning && timer !== null) {
      const id = setInterval(() => {
        if (timerRef.current > 0) {
          setTimer(prev => prev - 1);
        } else {
          clearInterval(id);
          handleTimerExpire();
        }
      }, 1000);
      return () => clearInterval(id);
    }
  }, [timerRunning, timer]);

  const handleCheckboxChange = (type, item) => {
    if (type === 'files' && item === 'File1') {
      handleFileChange(); // Handle file selection
      return;
    }

    setSelectedItems((prev) => {
      const newItems = [...prev[type]];
      const itemIndex = newItems.indexOf(item);

      if (itemIndex > -1) {
        newItems.splice(itemIndex, 1); // Remove item if already selected
      } else {
        newItems.push(item); // Add item if not selected
      }

      return { ...prev, [type]: newItems };
    });
  };

  const handleFileChange = async () => {
    try {
      const handles = await window.showOpenFilePicker({
        multiple: true, // Allow multiple file selection
      });

      const files = handles.map(async handle => {
        const file = await handle.getFile();
        return file.name;
      });

      const fileNames = await Promise.all(files);

      setSelectedItems(prev => ({
        ...prev,
        files: [...prev.files, ...fileNames],
      }));
    } catch (error) {
      console.error('Error opening files:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedItems.files.length === 0) {
      alert("Please select at least one file to terminate.");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setTimer(10); // Set timer to 30 seconds
    setTimerRunning(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleTimerExpire = async () => {
    setTimerRunning(false); // Stop the timer
    if (deleteTimeoutId) {
      clearTimeout(deleteTimeoutId); // Clear any remaining timeout
    }
    
    try {
      for (const fileName of selectedItems.files) {
        await deleteFile(fileName); // Call deleteFile for each file
      }
      setSelectedItems({ apps: [], files: [] });
      alert('Selected files have been deleted.');
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  return (
    <div className="terminator-page">
      <h2>Select Apps and Data to Terminate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Apps</h3>
          <div className="option-grid">
            <label className="option-card">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange('apps', 'Phone')}
              />
              <img src="https://cdn.pixabay.com/photo/2021/06/15/12/14/instagram-6338393_640.png" alt="Phone" />
    
            </label>
            <label className="option-card">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange('apps', 'Music')}
              />
              <img src="https://img.freepik.com/free-vector/modern-whatsapp-logo_1035-8973.jpg" alt="Music" />
            </label>
            <label className="option-card">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange('apps', 'Maps')}
              />
              <img src="https://static-00.iconduck.com/assets.00/snapchat-icon-1024x1024-799vt8j6.png" alt="Maps" />
  
            </label>
            <label className="option-card">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange('apps', 'Music')}
              />
              <img src="https://i.pinimg.com/736x/2e/6c/3f/2e6c3f56d41d284b0c477ebdce6997df.jpg" alt="Music" />
      
            </label>
            {/* Add more apps as needed */}
          </div>
        </div>

        <div className="form-section">
          <h3>Files</h3>
          <div className="option-grid">
            <label className="option-card" onClick={() => handleCheckboxChange('files', 'File1')}>
              <img src="https://cdn.icon-icons.com/icons2/3179/PNG/512/file_archive_icon_193973.png" alt="File 1" />
        
            </label>
            <label className="option-card" onClick={() => handleCheckboxChange('files', 'File2')}>
              <img src="https://thumbs.dreamstime.com/b/factory-reset-icon-reset-setting-factory-isolated-background-factory-reset-icon-reset-setting-factory-isolated-background-317301287.jpg" alt="File 2" />
              
            </label>
          </div>
          <div className="selected-files">
            {selectedItems.files.map((file, index) => (
              <div key={index} className="selected-file">
                {file}
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Terminate Selected</button>
      </form>

      {/* Confirmation screen */}
      {showConfirmation && (
        <div className="confirmation-screen">
          <div className="confirmation-content">
            <h2>Confirm Termination at Lifecycle End?</h2>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={handleCancel}>Cancel</button>
            <div className="timer-animation"></div>
          </div>
        </div>
      )}

      {/* Timer display */}
      {timerRunning && (
        <div className="timer">
          Time remaining: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
        </div>
      )}
    </div>
  );
};

export default TerminatorPage;
