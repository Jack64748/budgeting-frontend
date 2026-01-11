import React, { useState } from "react";

// This is a Functional Component. 
// It receives onData as a Prop.
function FileUpload({ onData }) {
  // A boolean flag
  const [loading, setLoading] = useState(false);
  // A string to store any error messages
  const [error, setError] = useState("");

  // function triggers the moment a user selects a file
  const handleUpload = async (e) => {
    // Grabs the first file selected from the input window
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    // FormData packages the file in a way that the .NET [FromForm] attribute can understand
    const formData = new FormData();
    // Adds the file to the package
    formData.append("file", file);

    try {
      // POST request sends data
      const response = await fetch("http://localhost:5170/api/Budget/upload", {
        method: "POST",
        // sends packaged file
        body: formData,
      });

      // safety check if error
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Upload failed');
      }

      // After processing the CSV, the backend sends back the updated list of transactions 
      // convert that JSON back into a JavaScript array.
      const data = await response.json();
      // send  new array back up to the Dashboard so it can update the table
      if (onData) onData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <input
        // standard choose file button
        type="file"
        onChange={handleUpload}
        // prevents button clicked while processing first click
        disabled={loading}
        // filter files
        accept=".csv,.txt"
      />
      {/*conditional rendering*/}
      {loading && <div>Uploading...</div>}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default FileUpload;