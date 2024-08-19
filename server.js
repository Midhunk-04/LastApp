const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

// Base directory for file operations
const BASE_DIR = path.resolve('C:/Users/Midhun/Downloads');

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
})); 

// Delete file endpoint
app.delete('/delete-file', (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  // Construct the full path to the file
  const fullPath = path.resolve(BASE_DIR, filePath);
  console.log(`Attempting to delete file at path: ${fullPath}`); // Log the path for debugging

  // Ensure the path is within the allowed directory
  const safePath = path.normalize(fullPath);
  if (!safePath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: 'Access to the requested file is forbidden' });
  }

  fs.unlink(safePath, (err) => {
    if (err) {
      console.error(`Error deleting file at ${safePath}:`, err);
      return res.status(500).json({ error: `Error deleting file at ${safePath}` });
    }
    console.log(`File ${filePath} deleted successfully`);
    res.status(200).json({ message: `File ${filePath} deleted successfully` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
