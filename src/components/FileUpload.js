import React, { useState } from "react";
import './FileUpload.css';

// Destructuring props to get onData (for the table) and onUploadSuccess (for navigation)
function FileUpload({ onData, onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5170/api/Budget/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // 2. Add a console log here to see if this code is even reached
        console.log("Server responded 200 OK. Triggering redirect...");

        // 3. This MUST match the prop name you used in UploadPage
        if (onUploadSuccess) {
          onUploadSuccess(); 
        }
      } 
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };


  return (
    <div className="file-upload-zone">
      {/* The label acts as the clickable button */}
      <label className={`upload-label ${loading ? 'loading' : ''}`}>
        {loading ? (
          <span className="spinner-text">Processing Statement...</span>
        ) : (
          "Click to Upload CSV"
        )}
        <input
          type="file"
          onChange={handleUpload}
          disabled={loading}
          accept=".csv"
          style={{ display: 'none' }} // Completely hides the default browser input
        />
      </label>

      {error && (
        <div className="error-message">
          <strong>⚠️ Upload Issue:</strong> {error}
        </div>
      )}

      <p className="upload-hint">Accepted format: Bank Export (.csv)</p>
    </div>
  );
}

export default FileUpload;